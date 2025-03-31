import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

// Middleware to protect user routes (Only authenticated users can access)
export const userAuth = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.token; 

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ message: "JWT Secret Key is missing" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        console.error("JWT Error:", error);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};