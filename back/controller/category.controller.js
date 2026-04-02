import mongoose from "mongoose";
import MainCategoryModel from "../model/mainCategory.model.js";
import CategoryModel from "../model/category.model.js";
import { ThrowError } from "../utils/Error.utils.js"
import { sendBadRequestResponse, sendNotFoundResponse, sendSuccessResponse } from "../utils/Response.utils.js"

export const createCategory = async (req, res) => {
  try {
    const { categoryName, mainCategoryId } = req.body;

    if (!categoryName || !mainCategoryId) {
      return sendBadRequestResponse(res, "categoryName & mainCategoryId are required!!!")
    }

    if (!mongoose.Types.ObjectId.isValid(mainCategoryId)) {
      return sendBadRequestResponse(res, "Invalid mainCategoryId!!!")
    }

    const checkMainCategory = await MainCategoryModel.findById(mainCategoryId)
    if (!checkMainCategory) {
      return sendBadRequestResponse(res, "MainCategory not exists!!!")
    }

    const checkCategory = await CategoryModel.findOne({ categoryName })
    if (checkCategory) {
      return sendBadRequestResponse(res, "This Category already added...")
    }

    const newCategory = await CategoryModel.create({
      mainCategoryId,
      categoryName,
    })

    return sendSuccessResponse(res, "Category added successfully...", newCategory)

  } catch (error) {
    return ThrowError(res, 500, error.message)
  }
}

export const getAllCategory = async (req, res) => {
  try {
    const category = await CategoryModel.find({}).populate("mainCategoryId")

    if (!category || category.length === 0) {
      return sendNotFoundResponse(res, "No category found!!!")
    }

    return sendSuccessResponse(res, "Category fetched Successfully...", category)

  } catch (error) {
    return ThrowError(res, 500, error.message)
  }
}

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequestResponse(res, "Invalid CategoryId!!!")
    }

    const category = await CategoryModel.findById(id).populate("mainCategoryId")
    if (!category) {
      return sendNotFoundResponse(res, "Category Not found...")
    }

    return sendSuccessResponse(res, "Category fetched Successfully...", category)

  } catch (error) {
    return ThrowError(res, 500, error.message)
  }
}

export const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, mainCategoryId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequestResponse(res, "Invalid category id!");
    }

    if (!mongoose.Types.ObjectId.isValid(mainCategoryId)) {
      return sendBadRequestResponse(res, "Invalid mainCategoryId!!!")
    }

    const checkMainCategory = await MainCategoryModel.findById(mainCategoryId)
    if (!checkMainCategory) {
      return sendBadRequestResponse(res, "MainCategory not exists!!!")
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { categoryName, mainCategoryId },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return sendNotFoundResponse(res, "Category Not found...");
    }

    return sendSuccessResponse(res, "Category updated successfully!", updatedCategory);

  } catch (error) {
    return ThrowError(res, 500, error.message);
  }
};

export const deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequestResponse(res, "Invalid CategoryId!!!");
    }

    const deletedCategory = await CategoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return sendNotFoundResponse(res, "Category Not found...");
    }

    return sendSuccessResponse(res, "Category deleted Successfully...", deletedCategory);

  } catch (error) {
    return ThrowError(res, 500, error.message);
  }
}

export const getCategoriesByMainCategoryId = async (req, res) => {
  try {
    const { mainCategoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(mainCategoryId)) {
      return sendBadRequestResponse(res, "Invalid mainCategoryId!!!")
    }

    const categories = await CategoryModel.find({ mainCategoryId })
      .populate("mainCategoryId")

    if (!categories || categories.length === 0) {
      return sendNotFoundResponse(res, "No categories found for this MainCategory!!!")
    }

    return sendSuccessResponse(res, "Categories fetched successfully...", categories)

  } catch (error) {
    return ThrowError(res, 500, error.message)
  }
}
