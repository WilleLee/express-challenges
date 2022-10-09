import express from "express";
import { naverCallback } from "../controllers/globalControllers";
import {
  edit,
  editPassword,
  postEdit,
  postEditPassword,
  user,
  users,
} from "../controllers/usersControllers";
import {
  imageUploader,
  loggedInUserOnly,
  ownMembersOnly,
} from "../middlewares/middlewares_challenge";

const usersRouter = express.Router();

usersRouter.get("/", users);
usersRouter.get("/naver/callback", naverCallback);
usersRouter.get("/:id", user);
usersRouter
  .route("/:id/edit")
  .all(loggedInUserOnly)
  .get(edit)
  .post(imageUploader.single("imageFile"), postEdit);
usersRouter
  .route("/:id/edit/password")
  .all(loggedInUserOnly, ownMembersOnly)
  .get(editPassword)
  .post(postEditPassword);

export default usersRouter;
