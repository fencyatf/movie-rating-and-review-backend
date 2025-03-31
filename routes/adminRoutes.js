import express from 'express'
import { 
    adminLogin, 
    adminLogout,
    getAllUsers, 
    banUser, 
    unbanUser, 
    deleteUser,  
    getAllMovies, 
    checkAdmin
} from '../controllers/adminController.js';
import { adminAuth  } from '../middleware/adminAuthMiddleware.js';

const router = express.Router()


//  Admin Authentication
router.post('/login', adminLogin);
router.get('/logout', adminAuth, adminLogout);

//  User Management
router.get('/users', adminAuth, getAllUsers);
router.put('/users/ban/:id', adminAuth, banUser);
router.put('/users/unban/:id', adminAuth, unbanUser);
router.delete('/users/:id', adminAuth, deleteUser);

//  Movie Management
router.get('/movies', adminAuth, getAllMovies);


//  Review Management
//router.get('/reviews', adminAuth, getAllReviews);

// Checking Admin
router.get('/check-admin',adminAuth,checkAdmin);

export {router as adminRouter};