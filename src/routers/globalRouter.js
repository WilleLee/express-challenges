import express from "express";
import {
  getUpload,
  home,
  join,
  login,
  logout,
  postJoin,
  postLogin,
  postUpload,
  search,
} from "../controllers/globalControllers";
import {
  loggedInUserOnly,
  publicOnly,
  videoUploader,
} from "../middlewares/middlewares_challenge";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/search", search);
globalRouter
  .route("/upload")
  .get(getUpload)
  .post(videoUploader.single("videoFile"), postUpload);
globalRouter.route("/join").all(publicOnly).get(join).post(postJoin);
globalRouter.route("/login").all(publicOnly).get(login).post(postLogin);
globalRouter.get("/logout", loggedInUserOnly, logout);

export default globalRouter;
