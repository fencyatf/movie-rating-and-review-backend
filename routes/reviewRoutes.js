import express from 'express';
import {
    addReview,
    updateReview,
    //getAllReviews,
    deleteReview,
    getReviewsByMovie,
    getUserReviews
} from '../controllers/reviewController.js';
import { userAuth } from '../middleware/userAuthMiddleware.js';
import { adminAuth } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

//  User Routes (Only logged-in users)
router.get('/user', userAuth, getUserReviews);

//  Public Routes (Accessible by all users)
router.get('/:movieId', getReviewsByMovie);

router.post('/:movieId', userAuth, addReview);
router.put('/:reviewId', userAuth, updateReview);
router.delete('/:reviewId', userAuth, deleteReview);

//  Admin Routes (Only admins)
//router.get('/reviews/:movieId', adminAuth, getAllReviews);
router.delete('/:reviewId/admin', adminAuth, deleteReview);

export { router as reviewRouter };