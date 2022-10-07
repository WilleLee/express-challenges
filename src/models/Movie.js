import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema({
  path: { type: String, requried: true },
  title: { type: String, required: true },
  note: { type: String, required: true },
  rating: { type: Number, required: true },
  year: { type: Number, required: true },
  genres: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
