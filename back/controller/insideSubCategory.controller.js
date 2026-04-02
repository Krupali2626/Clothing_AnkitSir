import mongoose from "mongoose";
import SubCategoryModel from "../model/subCategory.model.js";
import InsideSubCategoryModel from "../model/insideSubCategory.model.js";
import MainCategoryModel from "../model/mainCategory.model.js";
import CategoryModel from "../model/category.model.js";
import { ThrowError } from "../utils/Error.utils.js"
import { sendBadRequestResponse, sendNotFoundResponse, sendSuccessResponse } from "../utils/Response.utils.js"

export const createInsideSubCategory = async (req, res) => {
  try {
    const { insideSubCategoryName, subCategoryId, categoryId, mainCategoryId } = req.body;

    if (!insideSubCategoryName || !subCategoryId || !categoryId || !mainCategoryId) {
      return sendBadRequestResponse(res, "insideSubCategoryName, subCategoryId, categoryId, and mainCategoryId are required!!!")
    }

    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
      return sendBadRequestResponse(res, "Invalid SubCategoryId!!!");
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return sendBadRequestResponse(res, "Invalid categoryId!!!");
    }

    if (!mongoose.Types.ObjectId.isValid(mainCategoryId)) {
      return sendBadRequestResponse(res, "Invalid mainCategoryId!!!")
    }

    const checkMainCategory = await MainCategoryModel.findById(mainCategoryId)
    if (!checkMainCategory) {
      return sendBadRequestResponse(res, "MainCategory not exists!!!")
    }

    const checkCategory = await CategoryModel.findById(categoryId)
    if (!checkCategory) {
      return sendBadRequestResponse(res, "Category not exists!!!")
    }

    const checkSubCategory = await SubCategoryModel.findById(subCategoryId)
    if (!checkSubCategory) {
      return sendBadRequestResponse(res, "SubCategory not exists!!!")
    }

    const checkInsideSubCategory = await InsideSubCategoryModel.findOne({ insideSubCategoryName })
    if (checkInsideSubCategory) {
      return sendBadRequestResponse(res, "This InsideSubCategory already added...")
    }

    const newInsideSubCategory = await InsideSubCategoryModel.create({
      mainCategoryId,
      categoryId,
      subCategoryId,
      insideSubCategoryName,
    })

    return sendSuccessResponse(res, "InsideSubCategory added successfully...", newInsideSubCategory)

  } catch (error) {
    return ThrowError(res, 500, error.message)
  }
}

export const getAllInsideSubCategory = async (req, res) => {
  try {
    const insideSubCategory = await InsideSubCategoryModel.find({})
      .populate("mainCategoryId")
      .populate("categoryId")
      .populate("subCategoryId")

    if (!insideSubCategory || insideSubCategory.length === 0) {
      return sendNotFoundResponse(res, "No InsideSubCategory found!!!")
    }

    return sendSuccessResponse(res, "InsideSubCategory fetched Successfully...", insideSubCategory)

  } catch (error) {
    return ThrowError(res, 500, error.message)
  }
}

export const getInsideSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequestResponse(res, "Invalid InsideSubCategoryId!!!")
    }

    const insideSubCategory = await InsideSubCategoryModel.findById(id)
      .populate("mainCategoryId")
      .populate("categoryId")
      .populate("subCategoryId")

    if (!insideSubCategory) {
      return sendNotFoundResponse(res, "InsideSubCategory Not found...")
    }

    return sendSuccessResponse(res, "InsideSubCategory fetched Successfully...", insideSubCategory)

  } catch (error) {
    return ThrowError(res, 500, error.message)
  }
}

export const updateInsideSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { insideSubCategoryName, subCategoryId, categoryId, mainCategoryId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequestResponse(res, "Invalid InsideSubCategoryId!!!");
    }

    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
      return sendBadRequestResponse(res, "Invalid SubCategoryId!!!");
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return sendBadRequestResponse(res, "Invalid categoryId!!!");
    }

    if (!mongoose.Types.ObjectId.isValid(mainCategoryId)) {
      return sendBadRequestResponse(res, "Invalid mainCategoryId!!!")
    }

    const checkMainCategory = await MainCategoryModel.findById(mainCategoryId)
    if (!checkMainCategory) {
      return sendBadRequestResponse(res, "MainCategory not exists!!!")
    }

    const checkCategory = await CategoryModel.findById(categoryId)
    if (!checkCategory) {
      return sendBadRequestResponse(res, "Category not exists!!!")
    }

    const checkSubCategory = await SubCategoryModel.findById(subCategoryId)
    if (!checkSubCategory) {
      return sendBadRequestResponse(res, "SubCategory not exists!!!")
    }

    const updatedInsideSubCategory = await InsideSubCategoryModel.findByIdAndUpdate(
      id,
      { insideSubCategoryName, subCategoryId, categoryId, mainCategoryId },
      { new: true, runValidators: true }
    );

    if (!updatedInsideSubCategory) {
      return sendNotFoundResponse(res, "InsideSubCategory Not found...");
    }

    return sendSuccessResponse(res, "InsideSubCategory updated Successfully...", updatedInsideSubCategory);

  } catch (error) {
    return ThrowError(res, 500, error.message);
  }
};

export const deleteInsideSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequestResponse(res, "Invalid InsideSubCategoryId!!!");
    }

    const deletedInsideSubCategory = await InsideSubCategoryModel.findByIdAndDelete(id);

    if (!deletedInsideSubCategory) {
      return sendNotFoundResponse(res, "InsideSubCategory Not found...");
    }

    return sendSuccessResponse(res, "InsideSubCategory deleted Successfully...", deletedInsideSubCategory);

  } catch (error) {
    return ThrowError(res, 500, error.message);
  }
}

export const getInsideSubCategoriesBySubCategoryId = async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
      return sendBadRequestResponse(res, "Invalid subCategoryId!!!")
    }

    const insideSubCategories = await InsideSubCategoryModel.find({ subCategoryId })
      .populate("mainCategoryId")
      .populate("categoryId")
      .populate("subCategoryId")

    if (!insideSubCategories || insideSubCategories.length === 0) {
      return sendNotFoundResponse(res, "No InsideSubCategories found for this SubCategory!!!")
    }

    return sendSuccessResponse(res, "InsideSubCategories fetched successfully...", insideSubCategories)

  } catch (error) {
    return ThrowError(res, 500, error.message)
  }
}