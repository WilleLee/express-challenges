import express from "express";
import {
  filterMovie,
  movieDetail,
  movies,
} from "../controllers/movieControllers";

const movieRouter = express.Router();

movieRouter.get("/", movies);
movieRouter.get("/filter", filterMovie);
movieRouter.get("/:id", movieDetail);

export default movieRouter;
