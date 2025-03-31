import mongoose from "mongoose";
import { Watchlist } from "../models/watchlistModel.js";

//  Add a movie to the watchlist
export const addToWatchlist = async (req, res, next) => {
    try {
        const { movieId } = req.params; //  Extracting from params
        const userId = req.user.id;

        //  Check if the movie is already in the watchlist
        const existingItem = await Watchlist.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            movieId: new mongoose.Types.ObjectId(movieId)
        });

        if (existingItem) {
            return res.status(400).json({ message: "Movie is already in the watchlist" });
        }

        //  Add to watchlist
        const watchlistItem = new Watchlist({
            userId: new mongoose.Types.ObjectId(userId),
            movieId: new mongoose.Types.ObjectId(movieId)
        });

        await watchlistItem.save();
        res.status(201).json({ message: "Movie added to watchlist", watchlistItem });
    } catch (error) {
        next(error);
    }
};

//  Remove a movie from the watchlist
export const removeFromWatchlist = async (req, res, next) => {
    try {
        const { movieId } = req.params;
        const userId = req.user.id;

        const watchlistItem = await Watchlist.findOneAndDelete({
            userId: new mongoose.Types.ObjectId(userId),
            movieId: new mongoose.Types.ObjectId(movieId)
        });

        if (!watchlistItem) {
            return res.status(404).json({ message: "Movie not found in the watchlist" });
        }

        res.json({ message: "Movie removed from watchlist" });
    } catch (error) {
        next(error);
    }
};

//  Get a user's watchlist
export const getWatchlist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const watchlist = await Watchlist.find({ userId: userId })
            .populate("movieId", "title posterUrl");

         if (!watchlist) {
      return res.status(404).json({ message: "No watchlist found" });
    }

        // ✅ Filter out any entries where movieId is null
        const filteredWatchlist = watchlist.filter(item => item.movieId);

        res.json(filteredWatchlist);
    } catch (error) {
        next(error);
    }
};
