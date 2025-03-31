import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        type: { 
            type: String, 
            enum: ["review_warning", "like", "comment", "admin_message"], 
            required: true },
        message: { 
            type: String, 
            required: true 
        },
        isRead: { 
            type: Boolean, 
            default: false 
        }
    }, 
    { 
        timestamps: true 
    }
);

export const Notification = mongoose.model("Notification", notificationSchema);