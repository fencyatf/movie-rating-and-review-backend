import { Movie } from "../models/movieModel.js";
import { Genre } from "../models/genreModel.js";

// Add a genre to a movie
export const addGenreToMovie = async (req, res, next) => {
    try {
        const { movieId, genreId } = req.body;

        // Check if the movie exists
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        // Check if the genre exists
        const genre = await Genre.findById(genreId);
        if (!genre) {
            return res.status(404).json({ message: "Genre not found" });
        }

        // Check if the genre is already added
        if (movie.genres.includes(genreId)) {
            return res.status(400).json({ message: "Genre already added to movie" });
        }

        // Add genre to the movie
        movie.genres.push(genreId);
        await movie.save();

        res.status(200).json({ message: "Genre added to movie successfully", movie });
    } catch (error) {
        next(error);
    }
};

// Remove a genre from a movie
export const removeGenreFromMovie = async (req, res, next) => {
    try {
        const { movieId, genreId } = req.body;

        // Check if the movie exists
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        // Check if the genre exists in the movie
        if (!movie.genres.includes(genreId)) {
            return res.status(400).json({ message: "Genre not associated with this movie" });
        }

        // Remove genre from movie
        movie.genres = movie.genres.filter(id => id.toString() !== genreId);
        await movie.save();

        res.status(200).json({ message: "Genre removed from movie successfully", movie });
    } catch (error) {
        next(error);
    }
};

// Get movies by genre
export const getMoviesByGenre = async (req, res, next) => {
    try {
        const { genreId } = req.params;

        // Check if the genre exists
        const genre = await Genre.findById(genreId);
        if (!genre) {
            return res.status(404).json({ message: "Genre not found" });
        }

        // Find movies with the given genre
        const movies = await Movie.find({ genres: { $in: [genreId] } });


        if (movies.length === 0) {
            return res.status(404).json({ message: "No movies found for this genre" });
        }

        res.status(200).json(movies);
    } catch (error) {
        next(error);
    }
};
