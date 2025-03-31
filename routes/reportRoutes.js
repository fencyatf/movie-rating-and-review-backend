import express from 'express';
import { 
    reportReview, 
    getReports, 
    updateReportStatus 
} from '../controllers/reportController.js';
import { userAuth } from '../middleware/userAuthMiddleware.js';
import { adminAuth } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

//  Report a review
router.post('/', userAuth, reportReview);

//  Get all reports (Admin)
router.get('/', adminAuth,  getReports);

//  Update report status (Admin)
router.put('/:reportId', adminAuth,  updateReportStatus);

export {router as reportRouter};