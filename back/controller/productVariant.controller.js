import mongoose from "mongoose";
import ProductVariant from "../model/productVariant.model.js";
import Product from "../model/product.model.js";
import { sendBadRequestResponse, sendErrorResponse, sendNotFoundResponse, sendSuccessResponse, sendForbiddenResponse } from "../utils/Response.utils.js";
import { uploadFile, deleteManyFromS3 } from "../middleware/imageupload.js";

const generateSKU = (productName, color, size) => {
  const prodCode = productName.substring(0, 3).toUpperCase();
  const colorCode = color.substring(0, 3).toUpperCase();
  const sizeCode = size.substring(0, 2).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prodCode}-${colorCode}-${sizeCode}-${randomPart}`;
};

export const createProductVariant = async (req, res) => {
  try {
    const { productId, color, isDefault, options } = req.body;

    if (req.user.role !== "admin") {
      return sendForbiddenResponse(res, "Access denied. Only admin can create variants!");
    }

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return sendBadRequestResponse(res, "Invalid product ID.");
    }

    if (!color) {
      return sendBadRequestResponse(res, "Color is required.");
    }

    const product = await Product.findById(productId);
    if (!product) return sendNotFoundResponse(res, "Product not found.");

    let parsedOptions = [];
    if (options) {
      parsedOptions = typeof options === "string" ? JSON.parse(options) : options;
    }

    if (!Array.isArray(parsedOptions) || parsedOptions.length === 0) {
      return sendBadRequestResponse(res, "At least one option (sku, size, price, stock) is required.");
    }

    // Auto-generate SKUs for each option
    parsedOptions = parsedOptions.map(option => ({
      ...option,
      sku: option.sku || generateSKU(product.name, color, option.size)
    }));

    const uploadedImages = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const uploaded = await uploadFile(file);
        uploadedImages.push(uploaded.url);
      }
    }

    // If setting as default, update others first
    if (isDefault === true || isDefault === "true") {
      await ProductVariant.updateMany({ productId }, { isDefault: false });
    }

    const newVariant = await ProductVariant.create({
      productId,
      color,
      images: uploadedImages,
      isDefault: isDefault === true || isDefault === "true",
      options: parsedOptions,
    });

    await Product.findByIdAndUpdate(productId, {
      $push: { variants: newVariant._id },
    });

    return sendSuccessResponse(res, "Product Variant created successfully.", newVariant);
  } catch (error) {
    console.error("Create Variant Error:", error);
    return sendErrorResponse(res, 500, error.message);
  }
};

export const getAllProductVariant = async (req, res) => {
  try {
    const productVariants = await ProductVariant.find({})
      .populate("productId", "name")
      .sort({ createdAt: -1 });

    if (!productVariants || productVariants.length === 0) {
      return sendNotFoundResponse(res, "No ProductVariants found.");
    }

    return sendSuccessResponse(res, "ProductVariants fetched Successfully.", productVariants);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

export const getProductVariantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequestResponse(res, "Invalid ProductVariantId");
    }

    const variant = await ProductVariant.findById(id).populate("productId");

    if (!variant) {
      return sendNotFoundResponse(res, "ProductVariant Not Found.");
    }

    return sendSuccessResponse(res, "ProductVariant fetched Successfully.", variant);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

export const updateProductVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const { color, isDefault, options } = req.body;

    if (req.user.role !== "admin") {
      return sendForbiddenResponse(res, "Access denied. Only admin can update variants!");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequestResponse(res, "Invalid ProductVariant ID.");
    }

    const existingVariant = await ProductVariant.findById(id);
    if (!existingVariant) {
      return sendNotFoundResponse(res, "ProductVariant not found.");
    }

    const updateData = {};
    if (color) updateData.color = color;
    if (isDefault !== undefined) {
      const defaultValue = isDefault === true || isDefault === "true";
      if (defaultValue) {
        await ProductVariant.updateMany({ productId: existingVariant.productId }, { isDefault: false });
      }
      updateData.isDefault = defaultValue;
    }
    if (options) {
      const parsedOptions = typeof options === "string" ? JSON.parse(options) : options;
      const product = await Product.findById(existingVariant.productId);

      updateData.options = parsedOptions.map(option => ({
        ...option,
        sku: option.sku || generateSKU(product.name, color || existingVariant.color, option.size)
      }));
    }

    // Handle image updates if needed (simplified for now)
    // Replace old images with new ones
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      // 1. Delete old images from S3
      if (existingVariant.images && existingVariant.images.length > 0) {
        const oldImageKeys = existingVariant.images.map(url => {
          const split = url.split(".amazonaws.com/");
          return split.length > 1 ? split[1] : null;
        }).filter(Boolean);

        if (oldImageKeys.length > 0) {
          await deleteManyFromS3(oldImageKeys);
        }
      }

      // 2. Upload and set new images
      const uploadedImages = [];
      for (const file of req.files) {
        const uploaded = await uploadFile(file);
        uploadedImages.push(uploaded.url);
      }
      updateData.images = uploadedImages;
    }

    const updated = await ProductVariant.findByIdAndUpdate(id, updateData, { new: true });

    return sendSuccessResponse(res, "Variant updated successfully.", updated);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

export const deleteProductVariant = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin") {
      return sendForbiddenResponse(res, "Access denied. Only admin can delete variants!");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequestResponse(res, "Invalid ProductVariant ID!");
    }

    const variant = await ProductVariant.findById(id);
    if (!variant) return sendNotFoundResponse(res, "ProductVariant not found!");

    await Product.findByIdAndUpdate(variant.productId, {
      $pull: { variants: variant._id },
    });

    // Delete associated images from S3
    if (variant.images && variant.images.length > 0) {
      const imageKeys = variant.images.map(url => {
        const split = url.split(".amazonaws.com/");
        return split.length > 1 ? split[1] : null;
      }).filter(Boolean);

      if (imageKeys.length > 0) {
        await deleteManyFromS3(imageKeys);
      }
    }

    await ProductVariant.findByIdAndDelete(id);

    return sendSuccessResponse(res, "ProductVariant deleted successfully!");
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

export const getVariantsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return sendBadRequestResponse(res, "Valid productId is required!");
    }

    const variants = await ProductVariant.find({ productId }).sort({ isDefault: -1, createdAt: -1 });

    return sendSuccessResponse(res, "Product variants fetched successfully!", variants);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};
