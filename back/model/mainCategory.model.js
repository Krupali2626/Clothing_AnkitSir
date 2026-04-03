import mongoose from "mongoose";

const mainCategorySchema = mongoose.Schema({
    mainCategoryName: {
        type: String,
        required: true,
    },
    mainCategoryImage: {
        type: String,
        default: ""
    }
}, { timestamps: true })

export default mongoose.model("MainCategory", mainCategorySchema)