import mongoose from "mongoose";
import Order from "../model/order.model.js";
import Payment from "../model/payment.model.js";
import Cart from "../model/cart.model.js";
import ProductVariant from "../model/productVariant.model.js";
import User from "../model/user.model.js";
import productModel from "../model/product.model.js";
import { sendBadRequestResponse, sendErrorResponse, sendSuccessResponse } from "../utils/Response.utils.js";
import { createPayPalOrder, capturePayPalOrder } from "../utils/paypal.config.js";
import { createNotification } from "../utils/notification.utils.js";
import { sendOrderConfirmationEmail } from "../utils/Email.utils.js";

/**
 * Create PayPal order
 * Generates PayPal order and returns approval URL for user to complete payment
 */
export const createPayPalOrderController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user.id || req.user._id;

        // Get cart
        const cart = await Cart.findOne({ userId })
            .populate("items.productId", "name")
            .populate("items.productVariantId", "sku price stock options")
            .session(session);

        if (!cart || cart.items.length === 0) {
            await session.abortTransaction();
            return sendBadRequestResponse(res, "Cannot place order because cart is empty.");
        }

        // Get user and address
        const user = await User.findById(userId).session(session);
        if (!user || user.address.length === 0) {
            await session.abortTransaction();
            return sendBadRequestResponse(res, "Please add a shipping address before placing order.");
        }

        const activeAddress = user.address.find(addr => addr._id.toString() === user.selectedAddress?.toString()) || user.address[0];

        // Calculate order totals
        let billingAmount = 0;
        const orderProducts = [];
        const outOfStockItems = [];

        for (const item of cart.items) {
            const product = item.productId;
            const variant = item.productVariantId;

            if (!product || !variant) continue;

            let availableStock = 0;
            let unitPrice = 0;
            let optionSku = variant.sku;

            if (variant.options && variant.options.length > 0 && item.selectedSize) {
                const sizeObj = variant.options.find(o => o.size === item.selectedSize);
                if (sizeObj) {
                    availableStock = sizeObj.stock;
                    unitPrice = sizeObj.price;
                    optionSku = sizeObj.sku || optionSku;
                }
            } else {
                availableStock = variant.stock;
                unitPrice = variant.price;
            }

            if (availableStock < item.quantity) {
                outOfStockItems.push({
                    name: product.name,
                    size: item.selectedSize,
                    requested: item.quantity,
                    available: availableStock
                });
            } else {
                const subtotal = unitPrice * item.quantity;
                billingAmount += subtotal;

                orderProducts.push({
                    productId: product._id,
                    variantId: variant._id,
                    sku: optionSku,
                    name: product.name,
                    quantity: item.quantity,
                    price: unitPrice,
                    subtotal,
                    selectedSize: item.selectedSize
                });
            }
        }

        if (outOfStockItems.length > 0) {
            await session.abortTransaction();
            return sendBadRequestResponse(res, "Some items are out of stock.", { outOfStockItems });
        }

        // Apply coupon
        let discountAmount = 0;
        if (cart.appliedCoupon && cart.appliedCoupon.code) {
            const { discountType, percentageValue, flatValue } = cart.appliedCoupon;
            if (discountType === "percentage") {
                discountAmount = (billingAmount * percentageValue) / 100;
            } else if (discountType === "flat") {
                discountAmount = flatValue;
            }
            if (discountAmount > billingAmount) discountAmount = billingAmount;
        }

        const shippingCost = 25;
        const totalAmount = Math.max(0, billingAmount - discountAmount) + shippingCost;

        // Create PayPal order
        const paypalResponse = await createPayPalOrder(totalAmount, 'AUD', {
            description: `EO Studio Order - ${orderProducts.length} items`,
            orderId: `temp-${userId}-${Date.now()}`,
            returnUrl: `${process.env.FRONTEND_URL}/checkout/paypal-success`,
            cancelUrl: `${process.env.FRONTEND_URL}/checkout/paypal-cancel`,
        });

        if (!paypalResponse.success) {
            await session.abortTransaction();
            return sendErrorResponse(res, 500, "Failed to create PayPal order");
        }

        await session.commitTransaction();

        return sendSuccessResponse(res, "PayPal order created successfully", {
            paypalOrderId: paypalResponse.orderId,
            approvalUrl: paypalResponse.approvalUrl,
            totalAmount,
            message: "Redirect user to approvalUrl to complete payment"
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Create PayPal Order Error:", error);
        return sendErrorResponse(res, 500, "Error creating PayPal order", error.message);
    } finally {
        session.endSession();
    }
};

/**
 * Capture PayPal payment and create order
 * Called after user approves payment on PayPal
 */
export const capturePayPalPaymentController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user.id || req.user._id;
        const { paypalOrderId } = req.body;

        if (!paypalOrderId) {
            await session.abortTransaction();
            return sendBadRequestResponse(res, "PayPal Order ID is required");
        }

        // Capture PayPal payment
        const captureResponse = await capturePayPalOrder(paypalOrderId);

        if (!captureResponse.success || captureResponse.status !== 'COMPLETED') {
            await session.abortTransaction();
            return sendErrorResponse(res, 400, `PayPal payment not completed. Status: ${captureResponse.status}`);
        }

        // Get cart to build order
        const cart = await Cart.findOne({ userId })
            .populate("items.productId")
            .populate("items.productVariantId")
            .session(session);

        if (!cart || cart.items.length === 0) {
            await session.abortTransaction();
            return sendErrorResponse(res, 400, "Cart is empty. Order cannot be created.");
        }

        const user = await User.findById(userId).session(session);
        const activeAddress = user.address.find(addr => addr._id.toString() === user.selectedAddress?.toString()) || user.address[0];

        // Calculate order totals
        let billingAmount = 0;
        const orderProducts = [];

        for (const item of cart.items) {
            const product = item.productId;
            const variant = item.productVariantId;
            if (!product || !variant) continue;

            let unitPrice = variant.price;
            let optionSku = variant.sku;

            if (variant.options && variant.options.length > 0 && item.selectedSize) {
                const sizeObj = variant.options.find(o => o.size === item.selectedSize);
                if (sizeObj) {
                    unitPrice = sizeObj.price;
                    optionSku = sizeObj.sku || optionSku;
                }
            }

            const subtotal = unitPrice * item.quantity;
            billingAmount += subtotal;

            orderProducts.push({
                productId: product._id,
                variantId: variant._id,
                sku: optionSku,
                name: product.name,
                quantity: item.quantity,
                price: unitPrice,
                subtotal,
                selectedSize: item.selectedSize
            });
        }

        // Apply coupon
        let discountAmount = 0;
        if (cart.appliedCoupon && cart.appliedCoupon.code) {
            const { discountType, percentageValue, flatValue } = cart.appliedCoupon;
            if (discountType === "percentage") discountAmount = (billingAmount * percentageValue) / 100;
            else if (discountType === "flat") discountAmount = flatValue;
            if (discountAmount > billingAmount) discountAmount = billingAmount;
        }

        const shippingCost = 25;

        // Create Order
        const newOrder = new Order({
            userId,
            products: orderProducts,
            billingAmount,
            discountAmount,
            shippingCost,
            paymentStatus: "Paid",
            paymentMethod: "PayPal",
            shippingAddress: activeAddress,
            orderStatus: "Pending",
            appliedCoupon: cart.appliedCoupon || {},
            paypalOrderId: paypalOrderId,
            paypalCaptureId: captureResponse.captureId,
            paypalPayerEmail: captureResponse.payerEmail,
            timeline: [{
                status: "Pending",
                message: "Order placed and PayPal payment confirmed.",
                updatedBy: "system"
            }]
        });

        const savedOrder = await newOrder.save({ session });

        // Create Payment record
        const paymentRecord = new Payment({
            userId,
            orderId: savedOrder._id,
            amount: savedOrder.totalAmount,
            paymentMethod: "PayPal",
            paymentStatus: "Paid",
            paymentDate: new Date(),
            paypalOrderId: paypalOrderId,
            paypalCaptureId: captureResponse.captureId,
            paypalPayerEmail: captureResponse.payerEmail,
        });
        await paymentRecord.save({ session });

        // Reduce stock and increment sold count
        for (const item of orderProducts) {
            const variant = await ProductVariant.findById(item.variantId).session(session);
            if (variant) {
                if (variant.options && variant.options.length > 0 && item.selectedSize) {
                    const sizeObj = variant.options.find(o => o.size === item.selectedSize);
                    if (sizeObj) sizeObj.stock -= item.quantity;
                } else {
                    variant.stock -= item.quantity;
                }
                await variant.save({ session });
            }

            if (item.productId) {
                await productModel.findByIdAndUpdate(
                    item.productId,
                    { $inc: { sold: item.quantity } },
                    { session }
                );
            }
        }

        // Clear cart
        await Cart.deleteOne({ userId }).session(session);

        await session.commitTransaction();

        // Send confirmation email
        if (user && user.email) {
            sendOrderConfirmationEmail(user, savedOrder);
        }

        // Send notification
        createNotification({
            userId,
            title: "Order Placed!",
            message: `Your order #${savedOrder.orderId} has been placed successfully.`,
            type: "Order",
            metadata: { orderId: savedOrder._id }
        });

        return sendSuccessResponse(res, "PayPal payment captured and order created successfully", {
            orderId: savedOrder.orderId,
            _id: savedOrder._id,
            paymentStatus: "Paid",
            paypalOrderId: paypalOrderId,
            paypalCaptureId: captureResponse.captureId
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Capture PayPal Payment Error:", error);
        return sendErrorResponse(res, 500, "Error capturing PayPal payment", error.message);
    } finally {
        session.endSession();
    }
};

export default {
    createPayPalOrderController,
    capturePayPalPaymentController,
};
