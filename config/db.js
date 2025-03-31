import { connect } from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Admin } from "../models/adminModel.js"; 

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async () => {
    try {
        const response = await connect(MONGO_URI);
        console.log("DB connected successfully");

        // Check if an admin already exists
        const existingAdmin = await Admin.findOne({ email: "admin@gmail.com" });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin", 10); 
            const newAdmin = new Admin({
                name: "Admin",
                email: "admin@gmail.com",
                password: hashedPassword,
                role: "admin",
            });
            await newAdmin.save();
            // console.log("Default admin created:", newAdmin.email);
        } else {
            // console.log("Admin already exists:", existingAdmin.email);
        }

    } catch (error) {
        console.log("Database connection failed:", error);
    }
};
