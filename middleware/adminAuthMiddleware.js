import jwt from "jsonwebtoken";
import { Admin } from "../models/adminModel.js";

// Middleware to protect admin routes (Only authenticated admins can access)
export const adminAuth = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.token; 

        if (!token) {
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }

        if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ message: "JWT Secret Key is missing" });
        }

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.admin = await Admin.findById(decoded.id).select("-password");

        if (!req.admin) {
            return res.status(401).json({ message: "Admin not found" });
        }

        req.user = { 
            id: req.admin._id, 
            role: "admin" 
         };

        next();
    } catch (error) {
        console.error("JWT Error:", error.message);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Middleware to restrict access to admin-only routes
// export const adminOnly = (req, res, next) => {
//     if (req.admin?.isAdmin) {
//         next();
//     } else {
//         res.status(403).json({ message: "Not authorized as admin" });
//     }
// };
