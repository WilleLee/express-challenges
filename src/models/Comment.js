import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
  text: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  movie: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Movie" },
  createdAt: { type: Date, required: true, default: Date.now() },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
