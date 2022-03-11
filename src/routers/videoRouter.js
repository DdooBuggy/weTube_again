import express from "express";
import {
  getUpload,
  postUpload,
  watch,
  getEditVideo,
  postEditVideo,
  deleteVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.get("/:id(\\d+)", watch);
videoRouter.route("/:id(\\d+)/edit").get(getEditVideo).post(postEditVideo);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
