import express from "express";
import {
  deleteStory,
  editStory,
  story,
} from "../controllers/storiesControllers";

const storiesRouter = express.Router();

storiesRouter.get("/:id", story);
storiesRouter.get("/:id/edit", editStory);
storiesRouter.get("/:id/delete", deleteStory);

export default storiesRouter;
