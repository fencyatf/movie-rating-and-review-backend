import { Genre } from "../models/genreModel.js";
import { Movie } from "../models/movieModel.js";


// Create a new movie (Admin only)
export const addMovie = async (req, res, next) => {
    try {
        const {
            title, genre, releaseDate, director, duration, description, posterUrl } = req.body;

        // Ensure genre is an array and convert names to ObjectIds
        if (!Array.isArray(genre) || genre.some(id => typeof id !== "string")) {
            return res.status(400).json({ message: "Genre must be an array of ObjectIds" });
        }


        // Check if the movie already exists
        const existingMovie = await Movie.findOne({ title });
        if (existingMovie) {
            return next(new Error("Movie already exists"));
        }

        const newMovie = new Movie({
            title,
            genre,
            releaseDate,
            director,
            duration,
            description,
            posterUrl
        });

        const savedMovie = await newMovie.save();
        res.status(201).json({ message: "Movie added successfully", movie: savedMovie });
    } catch (error) {
        next(error);
    }
};


// Get all movies
export const getAllMovies = async (req, res, next) => {
    try {
        const movies = await Movie.find({}).populate("genre", "name").select("title genre releaseDate director duration description posterUrl averageRating ratingCount  ").sort("-createdAt");
        res.json(movies);
    } catch (error) {
        next(error);
    }
};

// Get a single movie by ID
export const getMovieById = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id).populate("genre", "name");

        if (!movie) {
            return next(new Error("Movie not found"));
        }

        res.json(movie);
    } catch (error) {
        next(error);
    }
};

// Update a movie (Admin only)
export const updateMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return next(new Error("Movie not found"));
        }

        // Convert genre names to ObjectIds if the genre field is provided
        let genreIds = movie.genre; // Keep existing genres if not updated
        if (req.body.genre) {
            if (!Array.isArray(req.body.genre)) {
                return next(new Error("Invalid genre format. Expected an array."));
            }

            const genres = await Genre.find({ _id: { $in: req.body.genre } });

            if (genres.length !== req.body.genre.length) {
                return next(new Error("One or more genres do not exist"));
            }

            genreIds = genres.map(genre => genre._id);
        }

        // Update movie fields
        movie.title = req.body.title || movie.title;
        movie.genre = genreIds;
        movie.releaseDate = req.body.releaseDate || movie.releaseDate;
        movie.director = req.body.director || movie.director;
        movie.duration = req.body.duration || movie.duration;
        movie.description = req.body.description || movie.description;
        movie.posterUrl = req.body.posterUrl || movie.posterUrl;


        const updatedMovie = await movie.save();

        res.json(updatedMovie);
    } catch (error) {
        next(error);
    }
};

// Delete a movie (Admin only)
export const deleteMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return next(new Error("Movie not found"));
        }

        await movie.deleteOne();
        res.json({ message: "Movie deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// Search movies by title or genre
export const searchMovies = async (req, res, next) => {
    try {
        const searchQuery = req.params.query;

        // Search by title using case-insensitive regex
        const movies = await Movie.find({
            title: { $regex: searchQuery, $options: "i" }
        }).populate("genre", "name");

        if (movies.length === 0) {
            return res.status(404).json({ message: "No movies found" });
        }

        res.json(movies);
    } catch (error) {
        next(error);
    }
};


// Get movies by genre
export const filterMoviesByGenre = async (req, res, next) => {
    try {
        const { genre } = req.params;

        // Find genre by name (case-insensitive)
        const genreDoc = await Genre.findOne({ name: { $regex: new RegExp(`^${genre}$`, "i") } });

        if (!genreDoc) {
            return res.status(404).json({ message: "Genre not found" });
        }

        // Fetch movies using the genre ID
        const movies = await Movie.find({ genre: genreDoc._id }).populate("genre", "name");

        if (movies.length === 0) {
            return res.status(404).json({ message: "No movies found in this genre" });
        }

        res.json(movies);
    } catch (error) {
        next(error);
    }
};
