import express from "express";
import { editProfile, user, users } from "../controllers/usersControllers";

const usersRouter = express.Router();

usersRouter.get("/", users);
usersRouter.get("/:id", user);
usersRouter.get("/edit-profile", editProfile);

export default usersRouter;
