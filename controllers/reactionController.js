import { Reaction } from "../models/reactionModel.js";
import { Movie } from "../models/movieModel.js";
import { Review } from "../models/reviewModel.js";

//  Get user reaction
export const getUserReactions = async (req, res, next) => {
    try {
        const userId = req.user.id; // Extract user ID from token

        // Fetch reactions from DB based on logged-in user ID
        const reactions = await Reaction.find({ userId });

        res.status(200).json({ message: "Reactions fetched successfully", reactions });
    } catch (error) {
        next(error);
    }
};


// Add a Reaction (Like/Dislike)
export const addReaction = async (req, res, next) => {
    try {
        const { movieId, reviewId, type } = req.body; // ✅ Ensure reviewId is included
        const userId = req.user.id;

        if (!movieId || !reviewId || !type) { 
            return res.status(400).json({ message: "Movie ID, Review ID, and Type are required" });
        }

        // Check if the movie exists
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        // Check if the review exists
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Check if the user has already reacted
        let reaction = await Reaction.findOne({ userId, movieId, reviewId });

        if (reaction) {
            // If the reaction already exists, update it
            reaction.type = type;
            await reaction.save();
            return res.json({ message: "Reaction updated successfully", reaction });
        }

        // Create a new reaction
        reaction = new Reaction({ userId, movieId, reviewId, type });
        await reaction.save();

        res.status(201).json({ message: "Reaction added successfully", reaction });
    } catch (error) {
        next(error);
    }
};


// Remove a Reaction
export const removeReaction = async (req, res, next) => {
    try {
        const { reactionId } = req.params;
        const userId = req.user.id;

        const reaction = await Reaction.findOne({ _id: reactionId, userId });
        if (!reaction) {
            return res.status(404).json({ message: "Reaction not found or unauthorized" });
        }

        await reaction.deleteOne();
        res.json({ message: "Reaction removed successfully" });
    } catch (error) {
        next(error);
    }
};

// Get All Reactions for a Movie
export const getReactions = async (req, res, next) => {
    try {
        const { movieId } = req.params;

        const reactions = await Reaction.find({ movieId }).populate("userId", "name profile_pic");

        if (!reactions.length) {
            return res.status(404).json({ message: "No reactions found for this movie" });
        }

        res.json(reactions);
    } catch (error) {
        next(error);
    }
};
