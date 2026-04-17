import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Order", "Promotion", "Account", "Alert"],
    default: "Alert",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  metadata: {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
    link: String,
  },
}, { timestamps: true });

const NotificationModel = mongoose.model("notification", NotificationSchema);
export default NotificationModel;
