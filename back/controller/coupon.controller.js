import mongoose from "mongoose";
import CouponModel from "../model/coupon.model.js";
import { ThrowError } from "../utils/Error.utils.js";
import { sendBadRequestResponse, sendNotFoundResponse, sendSuccessResponse } from "../utils/Response.utils.js";
import { deleteFileFromS3, uploadFile } from "../middleware/imageupload.js";

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      flatValue,
      percentageValue,
      minOrderValue,
      expiryDate,
      isActive,
    } = req.body;

    const file = req.file;

    if (!code || !description || !discountType || !expiryDate) {
      return sendBadRequestResponse(res, "All required fields must be provided");
    }

    if (!["flat", "percentage"].includes(discountType)) {
      return sendBadRequestResponse(res, "Discount type must be either 'flat' or 'percentage'");
    }

    let finalFlatValue = Number(flatValue) || 0;
    let finalPercentageValue = Number(percentageValue) || 0;

    if (discountType === "flat") {
      if (!finalFlatValue || finalFlatValue <= 0)
        return sendBadRequestResponse(res, "Flat value must be provided and > 0 for flat type");
      finalPercentageValue = 0;
    } else {
      if (!finalPercentageValue || finalPercentageValue <= 0 || finalPercentageValue > 100)
        return sendBadRequestResponse(res, "Percentage value must be between 1–100 for percentage type");
      finalFlatValue = 0;
    }

    const existCoupon = await CouponModel.findOne({ code: code.toUpperCase() });
    if (existCoupon) return sendBadRequestResponse(res, "Coupon code already exists");

    // Handling date in DD/MM/YYYY format as in reference
    const [day, month, year] = expiryDate.split("/").map(Number);
    const expiry = new Date(year, month - 1, day, 23, 59, 59, 999);
    if (expiry < new Date()) return sendBadRequestResponse(res, "Expiry date cannot be in the past");

    let couponImageUrl = null;
    if (file) {
      const uploaded = await uploadFile(file);
      couponImageUrl = uploaded.url;
    }

    const newCoupon = await CouponModel.create({
      code: code.toUpperCase(),
      description,
      discountType,
      flatValue: finalFlatValue,
      percentageValue: finalPercentageValue,
      minOrderValue: Number(minOrderValue) || 0,
      expiryDate: expiry,
      isActive: isActive === "false" ? false : true,
      couponImage: couponImageUrl,
    });

    return sendSuccessResponse(res, "Coupon created successfully", newCoupon);
  } catch (error) {
    console.error(error);
    return ThrowError(res, 500, error.message);
  }
};

export const getAllCoupon = async (req, res) => {
  try {
    const coupons = await CouponModel.find({
      isActive: true,
      expiryDate: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!coupons || coupons.length === 0) {
      return sendNotFoundResponse(res, "No active coupons found!");
    }

    return sendSuccessResponse(res, "Active coupons fetched successfully", coupons);
  } catch (error) {
    return ThrowError(res, 500, error.message);
  }
};

export const getAllCouponAdmin = async (req, res) => {
  try {
    const coupons = await CouponModel.find({}).sort({ createdAt: -1 });

    if (!coupons || coupons.length === 0) {
      return sendNotFoundResponse(res, "No coupons found!");
    }

    return sendSuccessResponse(res, "All coupons fetched successfully", coupons);
  } catch (error) {
    return ThrowError(res, 500, error.message);
  }
};

export const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequestResponse(res, "Invalid Coupon ID");
    }

    const coupon = await CouponModel.findById(id);
    if (!coupon) {
      return sendNotFoundResponse(res, "Coupon not found!");
    }

    return sendSuccessResponse(res, "Coupon fetched successfully", coupon);
  } catch (error) {
    return ThrowError(res, 500, error.message);
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    const {
      code,
      description,
      discountType,
      flatValue,
      percentageValue,
      minOrderValue,
      expiryDate,
      isActive,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequestResponse(res, "Invalid Coupon ID!");
    }

    const existingCoupon = await CouponModel.findById(id);
    if (!existingCoupon) {
      return sendNotFoundResponse(res, "Coupon not found!");
    }

    if (code && code !== existingCoupon.code) {
      const existCoupon = await CouponModel.findOne({
        code: code.toUpperCase(),
        _id: { $ne: id },
      });
      if (existCoupon) {
        return sendBadRequestResponse(res, "Coupon code already exists");
      }
    }

    const updates = { ...req.body };
    delete updates.id;

    if (updates.discountType || updates.flatValue || updates.percentageValue) {
      const type = updates.discountType || existingCoupon.discountType;

      if (type === "flat") {
        if (updates.flatValue !== undefined && Number(updates.flatValue) <= 0) {
          return sendBadRequestResponse(res, "Flat value must be greater than 0");
        }
        updates.percentageValue = 0;
      } else if (type === "percentage") {
        if (updates.percentageValue !== undefined && (Number(updates.percentageValue) <= 0 || Number(updates.percentageValue) > 100)) {
          return sendBadRequestResponse(res, "Percentage value must be between 1 and 100");
        }
        updates.flatValue = 0;
      }
    }

    if (updates.expiryDate) {
      const [day, month, year] = updates.expiryDate.split("/").map(Number);
      updates.expiryDate = new Date(year, month - 1, day, 23, 59, 59, 999);

      if (updates.expiryDate < new Date()) {
        return sendBadRequestResponse(res, "Expiry date cannot be in the past");
      }
    }

    if (updates.code) {
      updates.code = updates.code.toUpperCase();
    }

    if (updates.isActive !== undefined) {
      updates.isActive = updates.isActive === "false" ? false : true;
    }

    if (file) {
      if (existingCoupon.couponImage) {
        await deleteFileFromS3(existingCoupon.couponImage);
      }

      const uploaded = await uploadFile(file);
      updates.couponImage = uploaded.url;
    }

    const updatedCoupon = await CouponModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return sendSuccessResponse(res, "Coupon updated successfully!", updatedCoupon);
  } catch (error) {
    console.error("Error updating coupon:", error);
    return ThrowError(res, 500, error.message);
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequestResponse(res, "Invalid Coupon ID!");
    }

    const coupon = await CouponModel.findById(id);
    if (!coupon) {
      return sendNotFoundResponse(res, "Coupon not found!");
    }

    if (coupon.couponImage) {
      await deleteFileFromS3(coupon.couponImage);
    }

    await CouponModel.findByIdAndDelete(id);

    return sendSuccessResponse(res, "Coupon deleted successfully!", {
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return ThrowError(res, 500, error.message);
  }
};
