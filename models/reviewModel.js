import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        movieId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Movie", 
            required: true 
        },
        rating: { 
            type: Number, 
            required: true, 
            min: 1, 
            max: 5 
        },
        review: { 
            type: String, 
            trim:true,
            required: true 
        },
        reports: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                reason: { type: String, required: true },
                reportedAt: { type: Date, default: Date.now }
            }
        ] 
    },
    {
        timestamps: true
    }
);

export const Review = mongoose.model("Review", reviewSchema);
