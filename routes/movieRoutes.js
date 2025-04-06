import express from 'express';
import { 
    addMovie, 
    getAllMovies, 
    getMovieById, 
    updateMovie, 
    deleteMovie, 
    searchMovies, 
    filterMoviesByGenre 
} from '../controllers/movieController.js';
import { adminAuth } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

//  Public Routes (Accessible by all users)
router.get('/', getAllMovies); 
router.get('/search/:query', searchMovies); 
router.get('/genre/:genre', filterMoviesByGenre); 
router.get('/:id', getMovieById); 

//  Admin Routes (Only accessible by admins)


router.post('/', adminAuth,  addMovie); 
router.put('/:id', adminAuth,  updateMovie); 
router.delete('/:id', adminAuth,  deleteMovie); 

export {router as movieRouter};