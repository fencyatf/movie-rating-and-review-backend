import express from 'express';
import { 
    createGenre, 
    getGenres, 
    deleteGenre 
} from '../controllers/genreController.js';
import { adminAuth } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// Get all genres
router.get('/', getGenres);

// Create a new genre (Admin only)
router.post('/', adminAuth, createGenre);

// Delete a genre (Admin only) - Uses ID as a parameter
router.delete('/:id', adminAuth, deleteGenre);

export { router as genreRouter };
