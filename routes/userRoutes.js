import express from 'express';
import {
    userSignup,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    changeUserPassword,
    deleteMyAccount,
    forgotPassword,
    resetPassword,
    checkUser
} from '../controllers/userController.js';
import { userAuth } from '../middleware/userAuthMiddleware.js';
// import { 
//     addToWatchlist, 
//     getWatchlist, 
//     removeFromWatchlist 
// } from '../controllers/watchlistController.js';
import { getUserReviews } from '../controllers/reviewController.js';
import { getUserReactions } from '../controllers/reactionController.js';
import {upload} from "../middleware/multer.js"

const router = express.Router();

//  Authentication & User Management
router.post('/signup', userSignup);
router.post('/login', loginUser);
router.get('/logout', userAuth, logoutUser);

//  Profile Management
router.get('/profile', userAuth, getUserProfile);
router.put('/profile', userAuth, upload.single("profilePic"), updateUserProfile);
router.put('/profile/change-password', userAuth, changeUserPassword);

//  Account Management
router.delete('/delete-my-account', userAuth, deleteMyAccount);


//  Password Reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


//  User Activity (Reviews & Reactions)
router.get('/reviews', userAuth, getUserReviews);
router.get('/reactions', userAuth, getUserReactions);



// Checking User
router.get('/check-user',userAuth,checkUser);

export  {router as userRouter};