import mongoose from "mongoose";

const sizeGuideSizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  measurements: {
    type: Map,
    of: String,
    default: {},
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

const sizeGuideTableSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "MEN'S TOPS SIZE GUIDE"
  productInfo: { type: String, default: "Product info" }, // Header for the first column (e.g., "Product info", "Size", etc.)
  columns: [{ type: String, required: true }], // e.g., ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]
  rows: [{
    label: { type: String, required: true }, // e.g., "EU" or "Shoulders (cm)"
    values: [{ type: String, default: "" }] // array of values corresponding to columns
  }]
});

const sizeGuideSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "Men's Tops"
    tables: [sizeGuideTableSchema],
  },
  { timestamps: true }
);

const sizeGuideModel = mongoose.model("sizeGuide", sizeGuideSchema);

export default sizeGuideModel;
