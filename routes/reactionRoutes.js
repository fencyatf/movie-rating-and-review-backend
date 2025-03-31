import express from 'express';
import { 
    addReaction, 
    removeReaction, 
    getReactions 
} from '../controllers/reactionController.js';
import { userAuth } from '../middleware/userAuthMiddleware.js';

const router = express.Router();

//  Get all reactions for a review
router.get('/:reviewId', getReactions);

//  Add a like/dislike to a review
router.post('/', userAuth, addReaction);

//  Remove a reaction
router.delete('/:reactionId', userAuth, removeReaction);

export {router as reactionRouter};
