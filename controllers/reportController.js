import { Report } from "../models/reportModel.js";
import { Review } from "../models/reviewModel.js";
import { User } from "../models/userModel.js";

// Report a Review
export const reportReview = async (req, res, next) => {
    try {
        const { reviewId, reason } = req.body;
        const userId = req.user.id;

        // Check if the review exists
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Check if the user has already reported the review
        let existingReport = await Report.findOne({ userId, reviewId });
        if (existingReport) {
            return res.status(400).json({ message: "You have already reported this review" });
        }

        // Create a new report
        const report = new Report({ userId, reviewId, reason, status: "Pending" });
        await report.save();

        res.status(201).json({ message: "Review reported successfully", report });
    } catch (error) {
        next(error);
    }
};

// Get All Reports (For Admin)
export const getReports = async (req, res, next) => {
    try {
        const reports = await Report.find()
            .populate("userId", "name profile_pic")
            .populate("reviewId", "review rating");

        if (!reports.length) {
            return res.status(404).json({ message: "No reports found" });
        }

        res.json(reports);
    } catch (error) {
        next(error);
    }
};

// Update Report Status (For Admin)
export const updateReportStatus = async (req, res, next) => {
    try {
        const { reportId } = req.params;
        const { status } = req.body; // Expected values: "Pending", "Resolved", "Dismissed"

        const report = await Report.findById(reportId);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        report.status = status;
        await report.save();

        res.json({ message: "Report status updated successfully", report });
    } catch (error) {
        next(error);
    }
};
