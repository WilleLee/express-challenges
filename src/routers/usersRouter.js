import express from "express";
import { naverCallback } from "../controllers/globalControllers";
import { editProfile, user, users } from "../controllers/usersControllers";

const usersRouter = express.Router();

usersRouter.get("/", users);
usersRouter.get("/edit-profile", editProfile);
usersRouter.get("/naver/callback", naverCallback);
usersRouter.get("/:id", user);

export default usersRouter;
