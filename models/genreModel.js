import mongoose, { Schema } from "mongoose";

const genreSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

export const Genre = mongoose.model("Genre", genreSchema);
