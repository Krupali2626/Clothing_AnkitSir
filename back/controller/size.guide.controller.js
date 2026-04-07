import mongoose from "mongoose";
import sizeGuideModel from "../model/size.guide.model.js";
import productModel from "../model/product.model.js";
import { sendSuccessResponse, sendBadRequestResponse, sendNotFoundResponse, sendErrorResponse, sendForbiddenResponse } from "../utils/Response.utils.js";
import { ThrowError } from "../utils/Error.utils.js";

export const createSizeGuide = async (req, res) => {
  try {
    const { name, tables } = req.body;
    const { productId } = req.params;

    if (req.user.role !== "admin") {
      return sendForbiddenResponse(res, "Access denied. Only admin can create size guides!");
    }

    if (!name || !tables || !Array.isArray(tables)) {
      return sendBadRequestResponse(res, "Name and tables array are required.");
    }

    const sizeGuideData = {
      name,
      tables: tables.map(table => ({
        title: table.title,
        productInfo: table.productInfo || "Product info",
        columns: table.columns || [],
        rows: table.rows || []
      }))
    };

    const result = await sizeGuideModel.create(sizeGuideData);

    // If productId is provided, update the product's sizeGuide
    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      const updatedProduct = await productModel.findByIdAndUpdate(
        productId,
        { sizeGuide: result._id },
        { new: true }
      );

      if (!updatedProduct) {
        // Note: guide was created successfully, so we still return success but maybe mention product wasn't found
        return sendSuccessResponse(res, "Size guide created but product not found to link.", result);
      }
      return sendSuccessResponse(res, "Size guide created and product updated successfully.", { sizeGuide: result, product: updatedProduct });
    }

    return sendSuccessResponse(res, "Size guide created successfully.", result);

  } catch (error) {
    console.error("Size guide creation error:", error);
    return ThrowError(res, 500, error.message);
  }
};

export const updateSizeGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tables } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequestResponse(res, "Invalid size guide ID.");
    }

    if (req.user.role !== "admin") {
      return sendForbiddenResponse(res, "Access denied. Only admin can update size guides!");
    }

    const existing = await sizeGuideModel.findById(id);
    if (!existing) {
      return sendNotFoundResponse(res, "Size guide not found.");
    }

    let updateData = {};

    if (name) updateData.name = name;
    if (tables && Array.isArray(tables)) {
      updateData.tables = tables.map(table => ({
        title: table.title,
        productInfo: table.productInfo || "Product info",
        columns: table.columns || [],
        rows: table.rows || []
      }));
    }

    const updated = await sizeGuideModel.findByIdAndUpdate(id, updateData, {
      new: true
    });

    return sendSuccessResponse(res, "Size guide updated successfully.", updated);

  } catch (error) {
    console.error("Update size guide error:", error);
    return ThrowError(res, 500, error.message);
  }
};

export const deleteSizeGuide = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequestResponse(res, "Invalid size guide ID.");
    }

    if (req.user.role !== "admin") {
      return sendForbiddenResponse(res, "Access denied. Only admin can delete size guides!");
    }

    const sizeGuide = await sizeGuideModel.findById(id);
    if (!sizeGuide) {
      return sendNotFoundResponse(res, "Size guide not found.");
    }

    await sizeGuideModel.findByIdAndDelete(id);

    return sendSuccessResponse(res, "Size guide deleted successfully.");

  } catch (error) {
    console.error("Delete size guide error:", error);
    return ThrowError(res, 500, error.message);
  }
};

export const getAllSizeGuides = async (req, res) => {
  try {
    const result = await sizeGuideModel.find({})
      .sort({ createdAt: -1 });

    return sendSuccessResponse(res, "Size guides retrieved successfully.", {
      total: result.length,
      result: result
    });

  } catch (error) {
    return ThrowError(res, 500, error.message);
  }
};

export const getSizeGuideById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequestResponse(res, "Invalid size guide ID.");
    }

    const result = await sizeGuideModel.findById(id);

    if (!result) {
      return sendNotFoundResponse(res, "Size guide not found.");
    }

    return sendSuccessResponse(res, "Size guide fetched successfully.", result);

  } catch (error) {
    return ThrowError(res, 500, error.message);
  }
};

export const updateProductSizeGuide = async (req, res) => {
  try {
    const { productId } = req.params;
    const { sizeGuideId, name, tables } = req.body;

    if (req.user.role !== "admin") {
      return sendForbiddenResponse(res, "Access denied.");
    }

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return sendBadRequestResponse(res, "Invalid product ID.");
    }

    if (sizeGuideId && !mongoose.Types.ObjectId.isValid(sizeGuideId)) {
      return sendBadRequestResponse(res, "Invalid size guide ID.");
    }

    // 1. Link the Size Guide to the Product
    const product = await productModel.findByIdAndUpdate(
      productId,
      {
        $set: {
          sizeGuide: sizeGuideId || null
        }
      },
      { new: true }
    );

    if (!product) {
      return sendNotFoundResponse(res, "Product not found.");
    }

    // 2. If name or tables are passed, also update the actual Size Guide document
    let updatedSizeGuide = null;
    if (sizeGuideId && (name || tables)) {
      let updateData = {};

      if (name) updateData.name = name;
      if (tables && Array.isArray(tables)) {
        updateData.tables = tables.map(table => ({
          title: table.title,
          productInfo: table.productInfo || "Product info",
          columns: table.columns || [],
          rows: table.rows || []
        }));
      }

      updatedSizeGuide = await sizeGuideModel.findByIdAndUpdate(
        sizeGuideId,
        updateData,
        { new: true }
      );
    }

    return sendSuccessResponse(res, "Product size guide updated successfully.", {
      product,
      updatedSizeGuide
    });

  } catch (error) {
    console.error("Update product size guide error:", error);
    return ThrowError(res, 500, error.message);
  }
};

export const getProductSizeGuide = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return sendBadRequestResponse(res, "Invalid product ID.");
    }

    const product = await productModel.findById(productId)
      .populate('sizeGuide')
      .select('sizeGuide');

    if (!product) {
      return sendNotFoundResponse(res, "Product not found.");
    }

    return sendSuccessResponse(res, "Product size guide fetched successfully.", product.sizeGuide);

  } catch (error) {
    console.error("Get product size guide error:", error);
    return ThrowError(res, 500, error.message);
  }
};