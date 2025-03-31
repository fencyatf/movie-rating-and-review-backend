import mongoose, { Schema } from "mongoose";

const movieGenreSchema = new Schema(
    {
        movieId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Movie", 
            required: true 
        },
        genreId: {  
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Genre", 
            required: true 
        }
    }, 
    { 
        timestamps: true 
    }
);

export const MovieGenre = mongoose.model("MovieGenre", movieGenreSchema);
