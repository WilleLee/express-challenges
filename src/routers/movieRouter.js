import express from "express";
import {
  filterMovie,
  getAddMovie,
  movieDetail,
  movies,
  postAddMovie,
} from "../controllers/movieControllers";

const movieRouter = express.Router();

movieRouter.get("/", movies);
movieRouter.route("/add").get(getAddMovie).post(postAddMovie);
movieRouter.get("/filter", filterMovie);
movieRouter.get("/:id", movieDetail);

export default movieRouter;
