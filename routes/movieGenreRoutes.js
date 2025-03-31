import express from 'express';
import { 
    addGenreToMovie, 
    removeGenreFromMovie, 
    getMoviesByGenre 
} from '../controllers/movieGenreController.js';
import { adminAuth } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

//  Get all movies by a specific genre
router.get('/:genreId', getMoviesByGenre);

//  Admin-only routes for managing movie-genre relationships
router.post('/', adminAuth,  addGenreToMovie); 
router.delete('/:movieId/:genreId', adminAuth,  removeGenreFromMovie);

export {router as movieGenreRouter};