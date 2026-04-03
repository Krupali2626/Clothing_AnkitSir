import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  discountType: {
    type: String,
    required: true,
    enum: ["flat", "percentage"],
    default: "percentage"
  },
  flatValue: {
    type: Number,
    default: 0,
    min: 0
  },
  percentageValue: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  minOrderValue: {
    type: Number,
    default: 0,
    min: 0
  },
  expiryDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  couponImage: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Middleware to automatically deactivate expired coupons
couponSchema.pre('save', function (next) {
  if (this.expiryDate && this.expiryDate < new Date()) {
    this.isActive = false;
  }
  next();
});

// Static method to check if coupon is valid
couponSchema.statics.isValidCoupon = async function (code) {
  const coupon = await this.findOne({
    code: code.toUpperCase(),
    isActive: true,
    expiryDate: { $gt: new Date() }
  });
  return coupon;
};

const couponModel = mongoose.model("coupon", couponSchema);

export default couponModel;
