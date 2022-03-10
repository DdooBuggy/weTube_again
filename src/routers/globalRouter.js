import express from "express";
import { join } from "../controllers/userController";
import { trending, searchVideo } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", trending);
globalRouter.get("/join", join);
globalRouter.get("/search", searchVideo);

export default globalRouter;
