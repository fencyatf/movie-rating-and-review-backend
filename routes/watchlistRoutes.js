import express from 'express';
import { 
    addToWatchlist, 
    removeFromWatchlist, 
    getWatchlist 
} from '../controllers/watchlistController.js';
import { userAuth } from '../middleware/userAuthMiddleware.js';

const router = express.Router();

//  User Routes (Only logged-in users)
router.post('/:movieId', userAuth, addToWatchlist); 
router.delete('/:movieId', userAuth, removeFromWatchlist); 
router.get('/', userAuth, getWatchlist); 

export {router as watchlistRouter};