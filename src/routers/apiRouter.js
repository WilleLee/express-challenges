import express from "express";
import { deleteComment, postComment } from "../controllers/apiControllers";

const apiRouter = express.Router();

apiRouter.route("/movies/:id/comment").post(postComment).delete(deleteComment);
apiRouter.route("/comments/:id/delete").delete(deleteComment);

export default apiRouter;
