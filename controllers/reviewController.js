import { Review } from "../models/reviewModel.js";
import { Movie } from "../models/movieModel.js";
import mongoose from "mongoose";


// Add a Review
export const addReview = async (req, res, next) => {
    try {
        const movieId = req.params.movieId;
        const userId = req.user.id;
        const { rating, review } = req.body;

        console.log("Received data:", { movieId, userId, rating, review });

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return next(new Error("Movie not found"));
        }

        // Check if the user has already reviewed the movie
        const existingReview = await Review.findOne({ userId, movieId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this movie." });
        }

        const newReview = new Review({
            userId,
            movieId,
            rating,
            review,
            createdAt: new Date(),
        });

        await newReview.save();
        console.log("Successfully saved in DB:", newReview);


        // Update movie rating
        const allReviews = await Review.find({ movieId });
        const totalRatingsSum = allReviews.reduce((sum, currentReview) => sum + currentReview.rating, 0);
        movie.averageRating = totalRatingsSum / allReviews.length;
        movie.ratingCount = allReviews.length;
        await movie.save();

        res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (error) {
        console.error("Error saving review:", error.message);
        next(error);
    }
}


// Update a Review
export const updateReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { rating, review } = req.body;
        const userId = req.user.id;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }


        const existingReview = await Review.findOne({ _id: reviewId, userId });
        if (!existingReview) {
            return next(new Error("Review not found or unauthorized"));
        }

        existingReview.rating = rating || existingReview.rating;
        existingReview.review = review || existingReview.review;
        await existingReview.save();

        res.json({ message: "Review updated successfully", review: existingReview });
    } catch (error) {
        next(error);
    }
};

// Delete a Review
export const deleteReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;

        // Determine if the request is coming from a user or admin
        const userId = req.user?.id; // If user is authenticated
        const isAdmin = req.user?.role === "admin"; // If admin is authenticated

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: "Review not found" });

        // If an admin is deleting, allow it (e.g., deleting reported reviews)
        if (!isAdmin && review.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this review" });
        }

        await review.deleteOne();
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        next(error);
    }
};


//Get all reviews for a specific movie

export const getReviewsByMovie = async (req, res, next) => {
    try {
        const { movieId } = req.params;

        console.log("Fetching reviews for movie ID:", movieId);
        if (!mongoose.isValidObjectId(movieId)) {
            return res.status(400).json({ message: "Invalid movie ID format" });
        }


        console.log("Checking if movie exists...");
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        console.log("Movie found, fetching reviews...");
        const reviews = await Review.find({ movieId: new mongoose.Types.ObjectId(movieId) })
            .populate("userId", "name profile_pic")
            .exec();

        console.log("Fetched reviews:", reviews);

        res.status(200).json({ message: "Reviews fetched successfully", reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error.stack);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


// // Like a Review
// export const likeReview = async (req, res, next) => {
//     try {
//         const { reviewId } = req.params;
//         const userId = req.user.id;

//         const review = await Review.findById(reviewId);
//         if (!review) {
//             return res.status(404).json({ message: "Review not found" });
//         }

//         // Ensure likes and dislikes arrays exist
//         if (!review.likes) review.likes = [];
//         if (!review.dislikes) review.dislikes = [];

//         // Add like only if the user hasn't liked it already
//         if (!review.likes.includes(userId)) {
//             review.likes.push(userId);
//         }

//         // Remove the user from the dislikes array if they previously disliked the review
//         review.dislikes = review.dislikes.filter(id => id.toString() !== userId);

//         await review.save();
//         res.json({ message: "Review liked", review });
//     } catch (error) {
//         next(error);
//     }
// };


// // Dislike a Review
// export const dislikeReview = async (req, res, next) => {
//     try {
//         const { reviewId } = req.params;
//         const userId = req.user.id;

//         const review = await Review.findById(reviewId);
//         if (!review) {
//             return next(new Error("Review not found"));
//         }

//         // Ensure `dislikes` is always an array
//         if (!Array.isArray(review.dislikes)) {
//             review.dislikes = [];
//         }
//         if (!Array.isArray(review.likes)) {
//             review.likes = [];
//         }

//         if (!review.dislikes.includes(userId)) {
//             review.dislikes.push(userId);
//         }

//         review.likes = review.likes.filter(id => id.toString() !== userId);

//         await review.save();
//         res.json({ message: "Review disliked", review });
//     } catch (error) {
//         next(error);
//     }
// };


// // Report a Review
// export const reportReview = async (req, res, next) => {
//     try {
//         const { reviewId } = req.params;
//         const { reason } = req.body;
//         const userId = req.user.id;

//         // Validate reason
//         if (!reason) {
//             return res.status(400).json({ message: "Report reason is required" });
//         }

//         const review = await Review.findById(reviewId);
//         if (!review) {
//             return next(new Error("Review not found"));
//         }

//         // Ensure `reports` is an array before pushing
//         if (!Array.isArray(review.reports)) {
//             review.reports = [];
//         }

//         // Add report entry
//         review.reports.push({ userId, reason, reportedAt: new Date() });

//         await review.save();
//         res.json({ message: "Review reported successfully", review });
//     } catch (error) {
//         next(error);
//     }
// };


export const getUserReviews = async (req, res, next) => {
    try {
        const userId = req.user?.id;  // Ensure userId exists
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User not authenticated" });
        }
        
        console.log("Fetching reviews for user:", userId);

        const reviews = await Review.find({ userId })
            .populate("movieId", "title")  // Populate movie title
            .sort({ createdAt: -1 });

        res.status(200).json({ message: "User reviews fetched successfully", reviews });
    } catch (error) {
        next(error);
    }
};

