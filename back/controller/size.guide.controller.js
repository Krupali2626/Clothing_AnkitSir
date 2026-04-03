import mongoose from "mongoose";
import sizeGuideModel from "../model/size.guide.model.js";
import ProductVariant from "../model/productVariant.model.js";
import { sendSuccessResponse, sendBadRequestResponse, sendNotFoundResponse, sendErrorResponse, sendForbiddenResponse } from "../utils/Response.utils.js";
import { ThrowError } from "../utils/Error.utils.js";

export const createSizeGuide = async (req, res) => {
  try {
    const { name, category, description, region, measurements, sizes } = req.body;

    if (req.user.role !== "admin") {
      return sendForbiddenResponse(res, "Access denied. Only admin can create size guides!");
    }

    if (!name || !category) {
      return sendBadRequestResponse(res, "Name and category are required.");
    }

    if (!measurements || !measurements.fields || !Array.isArray(measurements.fields)) {
      return sendBadRequestResponse(res, "Measurement fields are required and must be an array.");
    }

    if (!sizes || !Array.isArray(sizes) || sizes.length === 0) {
      return sendBadRequestResponse(res, "Sizes array is required and must contain at least one size.");
    }

    const sizeGuideData = {
      name,
      category,
      description: description || "",
      region: region || [],
      measurements: {
        unit: measurements.unit || "cm",
        fields: measurements.fields
      },
      sizes: sizes.map(size => ({
        size: size.size,
        measurements: new Map(Object.entries(size.measurements || {})),
        status: size.status || "active"
      })),
    };

    const result = await sizeGuideModel.create(sizeGuideData);

    // Note: If you want to link it with a variant immediately, pass variantId in req.body and handle it.
    // However, for now, let's just create it.

    return sendSuccessResponse(res, "Size guide created successfully.", result);

  } catch (error) {
    console.error("Size guide creation error:", error);
    return ThrowError(res, 500, error.message);
  }
};

export const updateSizeGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, region, measurements, sizes } = req.body;

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
    if (category) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (region) updateData.region = region;

    if (measurements) {
      if (!measurements.fields || !Array.isArray(measurements.fields)) {
         return sendBadRequestResponse(res, "Measurement fields must be an array.");
      }
      updateData.measurements = {
        unit: measurements.unit || existing.measurements.unit,
        fields: measurements.fields
      };
    }

    if (sizes) {
      if (!Array.isArray(sizes) || sizes.length === 0) {
        return sendBadRequestResponse(res, "Sizes must be an array with at least one size.");
      }
      updateData.sizes = sizes.map(size => ({
        size: size.size,
        measurements: new Map(Object.entries(size.measurements || {})),
        status: size.status || "active"
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

export const updateVariantSizeGuide = async (req, res) => {
  try {
    const { variantId } = req.params;
    const { sizeGuideId } = req.body;

    if (req.user.role !== "admin") {
      return sendForbiddenResponse(res, "Access denied.");
    }

    if (!variantId || !mongoose.Types.ObjectId.isValid(variantId)) {
      return sendBadRequestResponse(res, "Invalid variant ID.");
    }

    if (sizeGuideId && !mongoose.Types.ObjectId.isValid(sizeGuideId)) {
      return sendBadRequestResponse(res, "Invalid size guide ID.");
    }

    const variant = await ProductVariant.findByIdAndUpdate(
      variantId,
      {
        $set: {
          sizeGuideId: sizeGuideId || null
        }
      },
      { new: true }
    );

    if (!variant) {
      return sendNotFoundResponse(res, "Product variant not found.");
    }

    return sendSuccessResponse(res, "Variant size guide updated successfully.", variant);

  } catch (error) {
    console.error("Update variant size guide error:", error);
    return ThrowError(res, 500, error.message);
  }
};

export const getVariantSizeGuide = async (req, res) => {
  try {
    const { variantId } = req.params;

    if (!variantId || !mongoose.Types.ObjectId.isValid(variantId)) {
      return sendBadRequestResponse(res, "Invalid variant ID.");
    }

    const variant = await ProductVariant.findById(variantId)
      .populate('sizeGuideId')
      .select('sizeGuideId');

    if (!variant) {
      return sendNotFoundResponse(res, "Product variant not found.");
    }

    return sendSuccessResponse(res, "Variant size guide fetched successfully.", variant.sizeGuideId);

  } catch (error) {
    console.error("Get variant size guide error:", error);
    return ThrowError(res, 500, error.message);
  }
};
