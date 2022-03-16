import express from "express";
import {
  logout,
  userProfile,
  getEdit,
  postEdit,
  deleteUser,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController";
import { loggedInOnlyMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", loggedInOnlyMiddleware, logout);
userRouter.get("/:id([0-9a-f]{24})", userProfile);
userRouter
  .route("/edit")
  .all(loggedInOnlyMiddleware)
  .get(getEdit)
  .post(postEdit);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/delete", deleteUser);

export default userRouter;
