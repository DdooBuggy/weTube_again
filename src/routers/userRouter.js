import express from "express";
import {
  login,
  logout,
  userProfile,
  edit,
  deleteUser,
} from "../controllers/userController";
const userRouter = express.Router();

userRouter.get("/login", login);
userRouter.get("/logout", logout);
userRouter.get("/:id(\\d+)", userProfile);
userRouter.get("/edit", edit);
userRouter.get("/delete", deleteUser);

export default userRouter;
