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
} from "../controllers/globalControllers";
import {
  loggedInUserOnly,
  publicOnly,
  videoUploader,
} from "../middlewares/middlewares_challenge";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter
  .route("/upload")
  .get(getUpload)
  .post(videoUploader.single("video"), postUpload);
globalRouter.route("/join").all(publicOnly).get(join).post(postJoin);
globalRouter.route("/login").all(publicOnly).get(login).post(postLogin);
globalRouter.get("/logout", loggedInUserOnly, logout);

export default globalRouter;
