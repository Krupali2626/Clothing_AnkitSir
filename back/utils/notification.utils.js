import NotificationModel from "../model/notification.model.js";
import { sendRealTimeNotification } from "./socket.js";

export const createNotification = async ({ userId, title, message, type = "Alert", metadata = {} }) => {
    try {
        const notification = await NotificationModel.create({
            user: userId,
            title,
            message,
            type,
            metadata
        });

        // Send real-time notification via Socket.io
        sendRealTimeNotification(userId, notification);

        return notification;
    } catch (error) {
        console.error("Error creating notification:", error.message);
    }
};
