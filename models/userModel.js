import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            minLength: 3,
            maxLength: 30,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        profilePic: {
            type: String,
            default: "",
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
        resetToken: {
            type: String,
        },
        tokenExpiry: {
            type: Date,
        },
        watchlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Movie", 
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model("User", userSchema);
