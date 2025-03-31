import express from 'express';
import { 
    createCategory, 
    getCategories, 
    updateCategory, 
    deleteCategory 
} from '../controllers/categoryController.js';
import { adminAuth } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

//  Public Route (Anyone can view categories)
router.get('/', getCategories); 

//  Admin Routes (Only Admins can modify categories)
router.post('/', adminAuth,  createCategory); 
router.put('/:id', adminAuth,  updateCategory); 
router.delete('/:id', adminAuth,  deleteCategory); 

export {router as categoryRouter};
