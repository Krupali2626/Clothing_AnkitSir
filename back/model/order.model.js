import mongoose from "mongoose";
import { nanoid } from "nanoid";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      variantId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant", required: true },
      sku: { type: String, default: null },
      name: { type: String },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true },
      subtotal: { type: Number },
      selectedSize: { type: String, default: null }
    },
  ],
  billingAmount: { type: Number, required: true, default: 0 },
  discountAmount: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true, default: 0 },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Processing", "Refunded"],
    default: "Pending",
    index: true,
  },
  paymentMethod: {
    type: String,
    enum: ["Card", "Zip Pay", "After Pay"],
    required: true
  },
  appliedCoupon: {
    code: String,
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: "coupon" },
    discountAmount: Number,
    discountType: String
  },
  shippingAddress: {
    type: Object,
    required: false
  },
  orderStatus: {
    type: String,
    enum: [
      "Pending",
      "On the way",
      "Delivered",
      "Cancelled",
    ],
    default: "Pending",
  },
  stripePaymentIntentId: { type: String, default: null },
  clientSecret: { type: String, default: null },
  cancelledAt: { type: Date, default: null },
  cancellationReason: { type: String, default: null },
  timeline: [
    {
      status: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      message: { type: String, required: true },
      updatedBy: { type: String, enum: ["system", "user", "admin"], default: "system" },
      note: { type: String, default: "" }
    }
  ],
}, {
  timestamps: true
});

// Pre-save middleware to generate orderId and calculate totals
orderSchema.pre("save", function (next) {
  if (this.isNew && !this.orderId) {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    this.orderId = `ORD-${datePart}-${nanoid(6)}`;
  }

  if (this.products && this.products.length > 0) {
    this.products.forEach((item) => {
      if (item.price && item.quantity) {
        item.subtotal = Math.round((item.quantity * parseFloat(item.price)) * 100) / 100;
      }
    });

    this.billingAmount = this.products.reduce((sum, product) => {
      return sum + (product.subtotal || 0);
    }, 0);
  }

  this.totalAmount = Math.round((
    (this.billingAmount || 0) -
    (this.discountAmount || 0) +
    (this.shippingCost || 0)
  ) * 100) / 100;

  next();
});

export default mongoose.model("Order", orderSchema);
