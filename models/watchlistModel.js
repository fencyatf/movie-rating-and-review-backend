import mongoose, { Schema } from "mongoose";

const watchlistSchema = new Schema(
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
    },
    {
        timestamps:true
    }
);

export const Watchlist = mongoose.model("Watchlist", watchlistSchema);