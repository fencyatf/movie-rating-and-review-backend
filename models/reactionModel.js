import mongoose, { Schema } from "mongoose";

const reactionSchema = new Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        movieId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
            required: true,
        },
        reviewId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Review", 
            required: true 
        },
        type: { 
            type: String, 
            enum: ["like", "dislike"], 
            required: true 
        }
    }, 
    { 
        timestamps: true 
    }
);

export const Reaction = mongoose.model("Reaction", reactionSchema);