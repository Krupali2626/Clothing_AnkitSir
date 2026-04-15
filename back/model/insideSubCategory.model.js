import mongoose from "mongoose";
import { slugify } from "../utils/slug.config.js";

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
  slug: {
    type: String,
    unique: true,
    index: true
  },
  insideSubCategoryImage: {
    type: String,
    default: ""
  }
}, { timestamps: true })

insideSubCategorySchema.pre('save', function (next) {
  if (this.isModified('insideSubCategoryName') || !this.slug) {
    this.slug = slugify(this.insideSubCategoryName);
  }
  next();
});

export default mongoose.model("insideSubCategory", insideSubCategorySchema)