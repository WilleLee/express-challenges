import express from "express";
import {
  getUpload,
  home,
  join,
  login,
  postUpload,
} from "../controllers/globalControllers";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.route("/upload").get(getUpload).post(postUpload);
globalRouter.get("/join", join);
globalRouter.get("/login", login);

export default globalRouter;
