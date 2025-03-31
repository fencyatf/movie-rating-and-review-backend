import { Notification } from "../models/notificationModel.js";

// Get User Notifications
export const getUserNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        if (!notifications.length) {
            return res.status(404).json({ message: "No notifications found" });
        }

        res.json(notifications);
    } catch (error) {
        next(error);
    }
};

// Mark Notification as Read
export const markAsRead = async (req, res, next) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findOne({ _id: notificationId, userId });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        notification.isRead = true;
        await notification.save();

        res.json({ message: "Notification marked as read", notification });
    } catch (error) {
        next(error);
    }
};

// Delete Notification
export const deleteNotification = async (req, res, next) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findOne({ _id: notificationId, userId });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        await notification.deleteOne();
        res.json({ message: "Notification deleted successfully" });
    } catch (error) {
        next(error);
    }
};
