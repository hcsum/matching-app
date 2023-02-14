import express from "express";
import { UserController } from "../controller";

const userRouter = express.Router();

userRouter.post("/user", UserController.addUser);
userRouter.get("/user/:userId", UserController.getUser);
userRouter.post("/user/:userId/bio", UserController.updateUserBio);

export default userRouter;
