import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        reviewId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Review", 
            required: true 
        },
        reason: { 
            type: String, 
            required: true 
        },
        status: { 
            type: String, 
            enum: ["pending", "reviewed", "resolved"], 
            default: "pending" 
        },
        reviewedBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Admin" 
        }
    }, 
    { 
        timestamps: true 
    }
);

export const Report = mongoose.model("Report", reportSchema);