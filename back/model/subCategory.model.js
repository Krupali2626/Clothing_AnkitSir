import mongoose from "mongoose";

const subCategorySchema = mongoose.Schema({
  mainCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MainCategory"
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  subCategoryName: {
    type: String,
    default: null
  },
  subCategoryImage: {
    type: String,
    default: ""
  }
}, { timestamps: true })

export default mongoose.model("SubCategory", subCategorySchema)