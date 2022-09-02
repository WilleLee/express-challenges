import express from "express";
import {
  home,
  join,
  login,
  news,
  trending,
} from "../controllers/globalControllers";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/trending", trending);
globalRouter.get("/news", news);
globalRouter.get("/join", join);
globalRouter.get("/login", login);

export default globalRouter;
