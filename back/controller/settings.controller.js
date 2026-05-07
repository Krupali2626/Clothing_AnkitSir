import Settings from '../model/settings.model.js';
import { sendErrorResponse, sendSuccessResponse } from '../utils/Response.utils.js';

export const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            // Create default settings if none exist
            settings = await Settings.create({});
        }
        return sendSuccessResponse(res, "Settings fetched successfully", settings);
    } catch (error) {
        return sendErrorResponse(res, 500, "Error fetching settings", error.message);
    }
};

// Public endpoint to get payment configuration (no auth required)
export const getPaymentConfig = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        
        // Return only public payment configuration
        const paymentConfig = {
            maxSavedCards: settings.payment?.maxSavedCards || 3,
            isStripeEnabled: settings.payment?.isStripeEnabled || true,
            isPaypalEnabled: settings.payment?.isPaypalEnabled || false,
            currency: settings.general?.currency || 'AUD',
        };
        
        return sendSuccessResponse(res, "Payment configuration fetched successfully", paymentConfig);
    } catch (error) {
        return sendErrorResponse(res, 500, "Error fetching payment configuration", error.message);
    }
};

export const updateSettings = async (req, res) => {
    try {
        const updateData = req.body;
        let settings = await Settings.findOne();
        
        if (!settings) {
            settings = new Settings(updateData);
        } else {
            // Update only provided sections
            if (updateData.general) settings.general = { ...settings.general, ...updateData.general };
            if (updateData.email) settings.email = { ...settings.email, ...updateData.email };
            if (updateData.payment) settings.payment = { ...settings.payment, ...updateData.payment };
            if (updateData.shipping) settings.shipping = { ...settings.shipping, ...updateData.shipping };
            if (updateData.notifications) settings.notifications = { ...settings.notifications, ...updateData.notifications };
        }

        await settings.save();
        return sendSuccessResponse(res, "Settings updated successfully", settings);
    } catch (error) {
        return sendErrorResponse(res, 500, "Error updating settings", error.message);
    }
};
