import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
  mainCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MainCategory"
  },
  categoryName: {
    type: String,
    default: null
  },
  categoryImage: {
    type: String,
    default: ""
  }
}, { timestamps: true })

export default mongoose.model("Category", categorySchema);

