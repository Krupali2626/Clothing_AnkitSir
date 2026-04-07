import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  sku: { type: String },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 }
});

const productVariantSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    color: { type: String, required: true },
    images: [String],
    isDefault: { type: Boolean, default: false },
    price: { type: Number, default: null },
    stock: { type: Number, default: null },
    sku: { type: String, default: null },
    options: [optionSchema]
  },
  { timestamps: true }
);

const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);
export default ProductVariant;