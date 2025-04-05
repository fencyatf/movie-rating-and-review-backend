import { Admin } from "../models/adminModel.js";
import { User } from "../models/userModel.js";
import { Movie } from "../models/movieModel.js";
import { Review } from "../models/reviewModel.js";
import { Report } from "../models/reportModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token.js";


// Admin Login
export const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        //console.log("Login attempt for:", email);

        const admin = await Admin.findOne({ email });

        if (!admin) {
            console.log("Admin not found!");
            return next(new Error("Invalid email or password"));
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return next(new Error("Invalid email or password"));
        }

        // Generate Token
        const token = generateToken(admin._id, "admin");

        // Store Token in HTTP-only Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.status(200).json({
            token,
            adminId: admin._id,
            role: "admin",
            message: "Admin Login successful"
        });

    } catch (error) {
        next(error);
    }
};

// Admin Logout
export const adminLogout = async (req, res, next) => {
    try {
        res.clearCookie("token", "", {
            httpOnly: true,
            secure: true,
            expires: new Date(0), // Expire the cookie
        });

        res.status(200).json({ message: "Admin logged out successfully" });

    } catch (error) {
        next(error);
    }
};

// Get all users
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// Ban a User
export const banUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new Error("User not found"));
        }

        user.isBanned = true;
        user.isActive = false; //  Ensure the user can't log in
        await user.save();
        res.json({ message: "User has been banned" });
    } catch (error) {
        next(error);
    }
};

// Unban a User
export const unbanUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new Error("User not found"));
        }

        user.isBanned = false;
        user.isActive = true; // Allow the user to log in again
        await user.save();
        res.json({ message: "User has been unbanned" });
    } catch (error) {
        next(error);
    }
};

// Delete a User
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new Error("User not found"));
        }

        await user.deleteOne();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};


// Get all movies
export const getAllMovies = async (req, res, next) => {
    try {
        const movies = await Movie.find().populate("genre", "name").sort({ createdAt: -1 });
        console.log("Sorted Movies:", movies); 
        res.json(movies);
    } catch (error) {
        next(error);
    }
};



// Get all reviews
// export const getAllReviews = async (req, res, next) => {
//     try {
//         const reviews = await Review.find().sort({createdAt:-1});
//         res.json(reviews);
//     } catch (error) {
//         next(error);
//     }
// };



// Get admin autherized
export const checkAdmin = async (req, res, next) => {
    try {

        res.json({ message: "Admin Autherized" });
    } catch (error) {
        next(error);
    }
}
