import mongoose from "mongoose";

export const UserAddressSchema = new mongoose.Schema({
  firstName: { type: String, trim: true, default: null },
  lastName: { type: String, trim: true, default: null },
  phone: {
    type: String,
    default: null,
    match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"]
  },
  zipcode: { type: String, default: null },
  address: { type: String, default: null },
  city: { type: String, default: null },
  state: { type: String, default: null },
  saveAs: {
    type: String,
    enum: ["Home", "Office", "Other"],
    default: "Home"
  },
  officeOpenOnSaturday: { type: Boolean, default: false },
  officeOpenOnSunday: { type: Boolean, default: false },
  recentlyViewed: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      viewedAt: { type: Date, default: Date.now },
    },
  ],
});

export const UserBillingAddressSchema = new mongoose.Schema({
  firstName: { type: String, trim: true, default: null },
  lastName: { type: String, trim: true, default: null },
  phone: {
    type: String,
    default: null,
    match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"]
  },
  zipcode: { type: String, default: null },
  address: { type: String, default: null },
  city: { type: String, default: null },
  state: { type: String, default: null },
  saveAs: {
    type: String,
    enum: ["Home", "Office", "Other"],
    default: "Home"
  },
  officeOpenOnSaturday: { type: Boolean, default: false },
  officeOpenOnSunday: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema({
  firstName: { type: String, default: null, trim: true },
  lastName: { type: String, default: null, trim: true },
  mobileNo: {
    type: String,
    required: true,
    unique: true,
    match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    default: null,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  fcmToken: {
    type: String,
    default: null
  },
  password: { type: String, select: false },
  address: [UserAddressSchema],
  billingaddress: [UserBillingAddressSchema],
  savedCards: [
    {
      cardNumber: { type: String, required: true },
      cardHolderName: { type: String, required: true },
      expiryDate: { type: String, required: true },
      cvv: { type: String, required: true },
      cardType: { type: String, default: "Card" },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  selectedAddress: { type: mongoose.Schema.Types.ObjectId, default: null },
  selectedBillingAddress: { type: mongoose.Schema.Types.ObjectId, default: null },
  otp: { type: Number, default: null },
  avatar: { type: String, default: null },
  resetOtpExpiry: { type: Date, default: null },
  verified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["user", "seller", "admin"],
    default: "user",
  },
  refreshToken: {
    type: String,
    default: null,
  },
}, { timestamps: true });

const UserModel = mongoose.model("user", UserSchema);
export default UserModel;