import Movie from "../models/Movie";
import Comment from "../models/Comment";
import User from "../models/User";

export const postComment = async (req, res) => {
  try {
    const {
      params: { id },
      body: { text },
      session: { loggedInUser },
    } = req;
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.sendStatus(404);
    }
    const comment = await Comment.create({
      text,
      owner: loggedInUser._id,
      movie: id,
    });
    const user = await User.findById(loggedInUser._id);
    movie.comments.push(comment._id);
    user.comments.push(comment._id);
    await movie.save();
    await user.save();
    return res.sendStatus(201);
  } catch (err) {
    console.log(err);
    return res.sendStatus(404);
  }
};
export const deleteComment = async (req, res) => {
  try {
    // id(commentId) 받아서 삭제
    const {
      params: { id },
      session: { loggedIn },
    } = req;
    const existing = await Comment.exists({ _id: id });
    if (!loggedIn || !existing) {
      return res.sendStatus(404);
    }
    await Comment.findByIdAndDelete(id);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(404);
  }
};
