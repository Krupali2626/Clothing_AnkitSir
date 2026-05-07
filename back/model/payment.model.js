import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    index: true,
  },
  clientSecret: {
    type: String,
    default: null
  },
  stripePaymentIntentId: {
    type: String,
    default: null
  },
  paypalOrderId: {
    type: String,
    default: null
  },
  paypalCaptureId: {
    type: String,
    default: null
  },
  paypalPayerEmail: {
    type: String,
    default: null
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["Card", "PayPal", "Zip Pay", "After Pay"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Processing", "Failed", "Refunded"],
    required: true,
    default: "Pending",
    index: true,
  },
  transactionId: {
    type: String,
    sparse: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  refundDate: {
    type: Date,
    default: null,
  },
  cardDetails: {
    cardNumber: String,
    cardHolderName: String,
    cardLast4Digits: String,
    cardType: String,
    expiryMonth: Number,
    expiryYear: Number,
    expiryDate: String,
    cvv: String,
  }
}, { timestamps: true });

const paymentModel = mongoose.model("Payment", paymentSchema);
export default paymentModel;
