import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import { generateToken } from "../utils/token.js";
import cloudinaryInstance from '../config/cloudinary.js'

//  Register a new user
export const userSignup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profilePic: "",
        });

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.status(201).json({ message: "User signup successful", user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
};

//  User login
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });

        if (user.isBanned) {
            return res.status(403).json({ message: "You are banned from logging in" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user._id)
        res.cookie('token', token, {
            httpOnly: true,
            secure: true
        })

        //Convert Mongoose document to plain object before deleting password
        //delete user.doc_.password;

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.status(200).json({ message: "Login successful", token, user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
};

//  Logout user
export const logoutUser = async (req, res) => {
    res.clearCookie("token", "", {
        httpOnly: true,
        expires: new Date(0), // Immediately expires the cookie
    });

    res.status(200).json({ message: "Logged out successfully" });
};


//  Get user profile
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user)
            return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            name: user.name,
            email: user.email,
            profilePic: user.profilePic, // Ensure profilePic is included
            createdAt: user.createdAt,
        });
    } catch (error) {
        next(error);
    }
};


//  Update user profile
export const updateUserProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let profilePic = user.profilePic;
        if (req.file) {
            const cloudinaryRes = await cloudinaryInstance.uploader.upload(req.file.path);
            profilePic = cloudinaryRes.secure_url;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.profilePic = profilePic;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        next(error);
    }
};



//  Change user password
export const changeUserPassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user)
            return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Incorrect old password" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        next(error);
    }
};

//  Forgot password - Send reset email
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user)
            return res.status(404).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetToken = resetToken;
        user.tokenExpiry = Date.now() + 3600000; // 1 hour expiry
        await user.save();

        const resetURL = `http://localhost:3000/reset-password/${resetToken}`;
        const message = `Click the link to reset your password: ${resetURL}`;

        await sendEmail({ to: user.email, subject: "Password Reset Request", text: message });

        res.status(200).json({ message: "Password reset link sent to email" });
    } catch (error) {
        next(error);
    }
};

//  Reset password
export const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({ resetToken: token, tokenExpiry: { $gt: Date.now() } });

        if (!user)
            return res.status(400).json({ message: "Invalid or expired token" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.tokenExpiry = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        next(error);
    }
};

//  Delete user account (Self)
export const deleteMyAccount = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user)
            return res.status(404).json({ message: "User not found" });

        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: "Your account has been deleted successfully" });
    } catch (error) {
        next(error);
    }
};

//  Delete user account (Admin)
export const deleteUserByAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user)
            return res.status(404).json({ message: "User not found" });

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted by admin successfully" });
    } catch (error) {
        next(error);
    }
};

//  Ban user account (Admin)
export const banUserByAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isActive) {
            return res.status(400).json({ message: "User is already banned" });
        }

        user.isActive = false;
        await user.save();

        res.status(200).json({ message: "User has been banned successfully" });
    } catch (error) {
        next(error);
    }
};


// Get user autherized
export const checkUser = async (req, res, next) => {
    try {

        res.json({ message: "User Autherized" });
    } catch (error) {
        next(error);
    }
}