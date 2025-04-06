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
    },
    {
        timestamps: true
    }
);
reviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });



export const Review = mongoose.model("Review", reviewSchema);
