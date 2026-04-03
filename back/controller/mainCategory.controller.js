import mongoose from "mongoose";
import MainCategoryModel from "../model/mainCategory.model.js";
import { ThrowError } from "../utils/Error.utils.js"
import { sendBadRequestResponse, sendNotFoundResponse, sendSuccessResponse } from "../utils/Response.utils.js"
import { uploadFile, deleteFileFromS3 } from "../middleware/imageupload.js";

export const createMainCategory = async (req, res) => {
  try {
    const { mainCategoryName } = req.body;

    if (!mainCategoryName) {
      return sendBadRequestResponse(res, "mainCategoryName is required!!!")
    }

    const checkMainCategory = await MainCategoryModel.findOne({ mainCategoryName })
    if (checkMainCategory) {
      return sendBadRequestResponse(res, "This MainCategory already exists...")
    }

    let imageUrl = "";
    if (req.file) {
      const uploadResult = await uploadFile(req.file);
      imageUrl = uploadResult.url;
    }

    const newMainCategory = await MainCategoryModel.create({
      mainCategoryName,
      mainCategoryImage: imageUrl
    })

    return sendSuccessResponse(res, "MainCategory added successfully...", newMainCategory)

  } catch (error) {
    return ThrowError(res, 500, error.message)
  }
}

export const getAllMainCategory = async (req, res) => {
  try {
    const mainCategory = await MainCategoryModel.find({})

    if (!mainCategory || mainCategory.length === 0) {
      return sendNotFoundResponse(res, "No MainCategory found!!!")
    }

    return sendSuccessResponse(res, "MainCategory fetched Successfully...", mainCategory)

  } catch (error) {
    return ThrowError(res, 500, error.message)
  }
}

export const getMainCategoryById = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequestResponse(res, "Invalid MainCategoryId!!!")
    }

    const mainCategory = await MainCategoryModel.findById(id)
    if (!mainCategory) {
      return sendNotFoundResponse(res, "MainCategory Not found...")
    }

    return sendSuccessResponse(res, "MainCategory fetched Successfully...", mainCategory)

  } catch (error) {
    return ThrowError(res, 500, error.message)
  }
}

export const updateMainCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { mainCategoryName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequestResponse(res, "Invalid MainCategoryId!!!");
    }

    const existingMainCategory = await MainCategoryModel.findById(id);
    if (!existingMainCategory) {
      return sendNotFoundResponse(res, "MainCategory Not found...");
    }

    let imageUrl = existingMainCategory.mainCategoryImage;
    if (req.file) {
      if (existingMainCategory.mainCategoryImage) {
        await deleteFileFromS3(existingMainCategory.mainCategoryImage);
      }
      const uploadResult = await uploadFile(req.file);
      imageUrl = uploadResult.url;
    }

    const updatedMainCategory = await MainCategoryModel.findByIdAndUpdate(
      id,
      { mainCategoryName, mainCategoryImage: imageUrl },
      { new: true, runValidators: true }
    );

    if (!updatedMainCategory) {
      return sendNotFoundResponse(res, "MainCategory Not found...");
    }

    return sendSuccessResponse(res, "MainCategory updated Successfully...", updatedMainCategory);

  } catch (error) {
    return ThrowError(res, 500, error.message);
  }
};

export const deleteMainCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequestResponse(res, "Invalid MainCategoryId!!!");
    }

    const mainCategoryToDelete = await MainCategoryModel.findById(id);
    if (!mainCategoryToDelete) {
      return sendNotFoundResponse(res, "MainCategory Not found...");
    }

    if (mainCategoryToDelete.mainCategoryImage) {
      await deleteFileFromS3(mainCategoryToDelete.mainCategoryImage);
    }

    const deletedMainCategory = await MainCategoryModel.findByIdAndDelete(id);

    if (!deletedMainCategory) {
      return sendNotFoundResponse(res, "MainCategory Not found...");
    }

    return sendSuccessResponse(res, "MainCategory deleted Successfully...", deletedMainCategory);

  } catch (error) {
    return ThrowError(res, 500, error.message);
  }
};