import express from 'express';
import { 
    addReview, 
    updateReview, 
    deleteReview, 
    getReviewsByMovie,
    getUserReviews, 
    // likeReview, 
    // dislikeReview, 
    // reportReview
    
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
// router.post('/:reviewId/like', userAuth, likeReview); 
// router.post('/:reviewId/dislike', userAuth, dislikeReview); 
// router.post('/:reviewId/report', userAuth, reportReview); 

//  Admin Routes (Only admins)
router.delete('/:reviewId/admin', adminAuth,  deleteReview); 

export {router as reviewRouter};