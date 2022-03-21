import express from "express";
import {
  registerView,
  createComment,
  deletComment,
} from "../controllers/videoController";
import { loggedInOnlyMiddleware } from "../middlewares";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post(
  "/videos/:id([0-9a-f]{24})/comment",
  loggedInOnlyMiddleware,
  createComment
);
apiRouter.delete(
  "/comments/:id([0-9a-f]{24})/delete",
  loggedInOnlyMiddleware,
  deletComment
);
export default apiRouter;
