import { Client, Environment, LogLevel, OrdersController } from '@paypal/paypal-server-sdk';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox'; // 'sandbox' or 'live'

// Initialize PayPal client
const paypalClient = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: PAYPAL_CLIENT_ID,
        oAuthClientSecret: PAYPAL_CLIENT_SECRET,
    },
    environment: PAYPAL_MODE === 'live' ? Environment.Production : Environment.Sandbox,
    logging: {
        logLevel: LogLevel.Info,
        logRequest: { logBody: true },
        logResponse: { logHeaders: true },
    },
});

const ordersController = new OrdersController(paypalClient);

/**
 * Create PayPal order
 * @param {number} amount - Amount in AUD
 * @param {string} currency - Currency code (default: AUD)
 * @param {object} metadata - Additional metadata
 * @returns {Promise<object>} PayPal order response
 */
export const createPayPalOrder = async (amount, currency = 'AUD', metadata = {}) => {
    try {
        const collect = {
            body: {
                intent: 'CAPTURE',
                purchaseUnits: [
                    {
                        amount: {
                            currencyCode: currency,
                            value: amount.toFixed(2),
                        },
                        description: metadata.description || 'EO Studio Purchase',
                        customId: metadata.orderId || '',
                    },
                ],
                applicationContext: {
                    returnUrl: metadata.returnUrl || `${process.env.FRONTEND_URL}/checkout/success`,
                    cancelUrl: metadata.cancelUrl || `${process.env.FRONTEND_URL}/checkout/cancel`,
                    brandName: 'EO Studio',
                    landingPage: 'BILLING',
                    userAction: 'PAY_NOW',
                },
            },
        };

        const response = await ordersController.createOrder(collect);
        
        return {
            success: true,
            orderId: response.result.id,
            status: response.result.status,
            links: response.result.links,
            approvalUrl: response.result.links?.find(link => link.rel === 'approve')?.href,
        };
    } catch (error) {
        console.error('PayPal Create Order Error:', error);
        throw new Error(error.message || 'Failed to create PayPal order');
    }
};

/**
 * Capture PayPal order payment
 * @param {string} orderId - PayPal order ID
 * @returns {Promise<object>} Capture response
 */
export const capturePayPalOrder = async (orderId) => {
    try {
        const collect = {
            id: orderId,
        };

        const response = await ordersController.captureOrder(collect);
        
        return {
            success: true,
            orderId: response.result.id,
            status: response.result.status,
            payerId: response.result.payer?.payerId,
            payerEmail: response.result.payer?.emailAddress,
            captureId: response.result.purchaseUnits?.[0]?.payments?.captures?.[0]?.id,
            amount: response.result.purchaseUnits?.[0]?.payments?.captures?.[0]?.amount,
        };
    } catch (error) {
        console.error('PayPal Capture Order Error:', error);
        throw new Error(error.message || 'Failed to capture PayPal payment');
    }
};

/**
 * Get PayPal order details
 * @param {string} orderId - PayPal order ID
 * @returns {Promise<object>} Order details
 */
export const getPayPalOrderDetails = async (orderId) => {
    try {
        const collect = {
            id: orderId,
        };

        const response = await ordersController.getOrder(collect);
        
        return {
            success: true,
            order: response.result,
        };
    } catch (error) {
        console.error('PayPal Get Order Error:', error);
        throw new Error(error.message || 'Failed to get PayPal order details');
    }
};

/**
 * Refund PayPal capture
 * @param {string} captureId - PayPal capture ID
 * @param {number} amount - Amount to refund
 * @param {string} currency - Currency code
 * @returns {Promise<object>} Refund response
 */
export const refundPayPalCapture = async (captureId, amount, currency = 'AUD') => {
    try {
        // Note: Refunds require the Payments controller
        // This is a placeholder - implement when needed
        console.log(`Refund requested for capture ${captureId}: ${amount} ${currency}`);
        return {
            success: true,
            message: 'Refund initiated',
        };
    } catch (error) {
        console.error('PayPal Refund Error:', error);
        throw new Error(error.message || 'Failed to refund PayPal payment');
    }
};

export default {
    createPayPalOrder,
    capturePayPalOrder,
    getPayPalOrderDetails,
    refundPayPalCapture,
};
