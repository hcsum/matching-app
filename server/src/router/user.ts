import express from "express";
import { UserController } from "../controller";

const userRouter = express.Router();

userRouter.post("/user/upsert", UserController.upsertUser);

userRouter.use("/user", UserController.userGuard);

userRouter.get("/user/:userId", UserController.getUser);
userRouter.put("/user/:userId/", UserController.updateUser);
userRouter.get("/user/:userId/photos", UserController.getPhotosByUserId);
userRouter.post(
  "/user/:userId/photo-uploaded",
  UserController.handlePhotoUploaded
);

export default userRouter;

