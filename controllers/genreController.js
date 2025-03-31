import { Genre } from "../models/genreModel.js";

// Create a new genre
export const createGenre = async (req, res, next) => {
    try {
        const { name } = req.body;
        const existingGenre = await Genre.findOne({ name });
        if (existingGenre) {
            return res.status(400).json({ message: "Genre already exists" });
        }

        const genre = new Genre({ name });
        await genre.save();

        res.status(201).json({ message: "Genre created successfully", genre });
    } catch (error) {
        next(error);
    }
};

// Get all genres
export const getGenres = async (req, res, next) => {
    try {
        const genres = await Genre.find().sort({ createdAt: -1 });
        res.json(genres);
    } catch (error) {
        next(error);
    }
};

// Delete a genre
export const deleteGenre = async (req, res, next) => {
    try {
        const { id } = req.params; // Extract genre ID from request params

        const genre = await Genre.findById(id);
        if (!genre) {
            return res.status(404).json({ message: "Genre not found" });
        }

        await genre.deleteOne();
        res.json({ message: "Genre deleted successfully" });
    } catch (error) {
        next(error);
    }
};
