import mongoose from "mongoose"
import { slugify } from "../utils/slug.config.js";

const categorySchema = new mongoose.Schema({
  mainCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MainCategory"
  },
  categoryName: {
    type: String,
    default: null
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  categoryImage: {
    type: String,
    default: ""
  }
}, { timestamps: true })

categorySchema.pre('save', function (next) {
  if (this.isModified('categoryName') || !this.slug) {
    this.slug = slugify(this.categoryName);
  }
  next();
});

export default mongoose.model("Category", categorySchema);

