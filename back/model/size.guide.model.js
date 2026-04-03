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

const sizeGuideSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: String,

    region: [{ type: String, required: true }],

    measurements: {
      unit: { type: String, default: null },
      fields: [{ type: String, required: true }],
    },

    sizes: [sizeGuideSizeSchema],

  },
  { timestamps: true }
);

const sizeGuideModel = mongoose.model("sizeGuide", sizeGuideSchema);

export default sizeGuideModel;
