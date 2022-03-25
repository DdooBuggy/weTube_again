import express from "express";
import {
  getUpload,
  postUpload,
  watch,
  getEditVideo,
  postEditVideo,
  deleteVideo,
} from "../controllers/videoController";
import { loggedInOnlyMiddleware, videoUploadMiddleware } from "../middlewares";

const videoRouter = express.Router();

videoRouter
  .route("/upload")
  .all(loggedInOnlyMiddleware)
  .get(getUpload)
  .post(videoUploadMiddleware, postUpload);
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(loggedInOnlyMiddleware)
  .get(getEditVideo)
  .post(postEditVideo);
videoRouter.get(
  "/:id([0-9a-f]{24})/delete",
  loggedInOnlyMiddleware,
  deleteVideo
);

export default videoRouter;
