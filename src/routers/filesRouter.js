import express from "express";
import { file, home, read } from "../controllers/filesControllers";
import { textUploader } from "../middlewares/middlewares_challenge";

const filesRouter = express.Router();

filesRouter.route("/").get(home);
filesRouter.route("/read").post(textUploader.single("text"), read);
filesRouter.get("/:id", file);

export default filesRouter;
