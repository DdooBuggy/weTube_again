import express from "express";
import {
  getUpload,
  postUpload,
  watch,
  getEditVideo,
  postEditVideo,
  deleteVideo,
} from "../controllers/videoController";
import { loggedInOnlyMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter
  .route("/upload")
  .all(loggedInOnlyMiddleware)
  .get(getUpload)
  .post(
    videoUpload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    postUpload
  );
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
