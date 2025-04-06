import express from 'express';
import { userRouter } from './userRoutes.js';
import { adminRouter } from './adminRoutes.js';
import { movieRouter } from './movieRoutes.js';
import { reviewRouter } from './reviewRoutes.js';
import { watchlistRouter } from './watchlistRoutes.js';
// import { categoryRouter } from './categoryRoutes.js';
// import { movieGenreRouter } from './movieGenreRoutes.js';
// import { reactionRouter } from './reactionRoutes.js';
// import { reportRouter } from './reportRoutes.js';
// import { notificationRouter } from './notificationRoutes.js';
import { genreRouter } from './genreRoutes.js';


const router = express.Router()

router.use('/user',userRouter)
router.use('/admin',adminRouter)
router.use('/movies',movieRouter)
router.use('/reviews',reviewRouter)
router.use('/watchlist',watchlistRouter)
router.use('/genres',genreRouter)
// router.use('/categories',categoryRouter)
// router.use('/movie-genres',movieGenreRouter)
// router.use('/reactions',reactionRouter)
// router.use('/reports',reportRouter)
// router.use('/notifications',notificationRouter)


export {router as apiRouter}