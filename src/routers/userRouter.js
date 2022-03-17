import express from "express";
import {
  logout,
  userProfile,
  getEdit,
  postEdit,
  getChangePassword,
  postChangePassword,
  deleteUser,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController";
import {
  loggedInOnlyMiddleware,
  publicOnlyMiddleware,
  avatarUpload,
} from "../middlewares";

const userRouter = express.Router();

userRouter
  .route("/edit")
  .all(loggedInOnlyMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
userRouter
  .route("/changePassword")
  .all(loggedInOnlyMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/logout", loggedInOnlyMiddleware, logout);
userRouter.get("/:id([0-9a-f]{24})", userProfile);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/delete", deleteUser);

export default userRouter;
