import mongoose from "mongoose";

const insideSubCategorySchema = mongoose.Schema({
  mainCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MainCategory"
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory"
  },
  insideSubCategoryName: {
    type: String,
  },
}, { timestamps: true })

export default mongoose.model("insideSubCategory", insideSubCategorySchema)