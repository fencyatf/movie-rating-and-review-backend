import express from 'express';
import { 
    getUserNotifications, 
    markAsRead, 
    deleteNotification 
} from '../controllers/notificationController.js';
import { userAuth } from '../middleware/userAuthMiddleware.js';

const router = express.Router();

//  Get notifications for a user
router.get('/', userAuth, getUserNotifications);

//  Mark a notification as read
router.put('/:notificationId', userAuth, markAsRead);

//  Delete a notification
router.delete('/:notificationId', userAuth, deleteNotification);

export {router as notificationRouter};
