import NotificationModel from "../model/notification.model.js";
import { sendSuccessResponse, sendErrorResponse } from "../utils/Response.utils.js";

export const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const notifications = await NotificationModel.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(50);
        
        return sendSuccessResponse(res, "Notifications fetched successfully", notifications);
    } catch (error) {
        return sendErrorResponse(res, 500, "Error fetching notifications", error.message);
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await NotificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true });
        return sendSuccessResponse(res, "Notification marked as read", notification);
    } catch (error) {
        return sendErrorResponse(res, 500, "Error updating notification", error.message);
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        await NotificationModel.updateMany({ user: userId, isRead: false }, { isRead: true });
        return sendSuccessResponse(res, "All notifications marked as read");
    } catch (error) {
        return sendErrorResponse(res, 500, "Error updating notifications", error.message);
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        await NotificationModel.findByIdAndDelete(id);
        return sendSuccessResponse(res, "Notification deleted");
    } catch (error) {
        return sendErrorResponse(res, 500, "Error deleting notification", error.message);
    }
};
