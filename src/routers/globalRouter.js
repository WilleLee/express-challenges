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

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.route("/upload").get(getUpload).post(postUpload);
globalRouter.route("/join").get(join).post(postJoin);
globalRouter.route("/login").get(login).post(postLogin);
globalRouter.get("/logout", logout);

export default globalRouter;
