import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    productVariantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductVariant",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
        default: 1,
    },
    selectedSize: {
        type: String,
        default: null
    }
});

const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [CartItemSchema],
        appliedCoupon: {
            couponId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Coupon",
                default: null
            },
            code: { type: String, default: null },
            discountAmount: { type: Number, default: 0 },
            discountType: { type: String, default: null },
            percentageValue: { type: Number, default: 0 },
            flatValue: { type: Number, default: 0 }
        }
    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
