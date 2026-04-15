import mongoose from "mongoose";
import { slugify } from "../utils/slug.config.js";

const mainCategorySchema = mongoose.Schema({
    mainCategoryName: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    mainCategoryImage: {
        type: String,
        default: ""
    }
}, { timestamps: true })

mainCategorySchema.pre('save', function (next) {
    if (this.isModified('mainCategoryName') || !this.slug) {
        this.slug = slugify(this.mainCategoryName);
    }
    next();
});

export default mongoose.model("MainCategory", mainCategorySchema)