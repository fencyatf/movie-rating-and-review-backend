import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js"; 

// Configure Multer to upload directly to Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,  
    params: {
        folder: "profile_pictures",
        format: async (req, file) => "jpg", // Ensuring JPG format
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

export const upload = multer({ storage });
