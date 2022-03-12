import express from "express";
import { join } from "../controllers/userController";
import { home, searchVideo } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/join", join);
globalRouter.get("/search", searchVideo);

export default globalRouter;
