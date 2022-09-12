import express from "express";
import {
  deleteMovie,
  getEditMovie,
  movie,
  postEditMovie,
} from "../controllers/movieControllers";

const movieRouter = express.Router();

movieRouter.get("/:id", movie);
movieRouter.route("/:id/edit").get(getEditMovie).post(postEditMovie);
movieRouter.get("/:id/delete", deleteMovie);

export default movieRouter;
