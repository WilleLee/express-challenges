import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema({
  title: { type: String, required: true },
  note: { type: String, required: true },
  rating: { type: Number, required: true },
  year: { type: Number, required: true },
  genres: [String],
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
