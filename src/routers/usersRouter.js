import express from "express";
import { editProfile, user, users } from "../controllers/usersControllers";

const usersRouter = express.Router();

usersRouter.get("/", users);
usersRouter.get("/edit-profile", editProfile);
usersRouter.get("/:id", user);

export default usersRouter;
