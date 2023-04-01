import express from "express";
import { UserController } from "../controller";

const userRouter = express.Router();

// todo: move cos sts to another handler and route
userRouter.get("/cos/sts", UserController.getCosCredentialHandler);

userRouter.post("/user/upsert", UserController.upsertUser);

userRouter.get("/user/:userId", UserController.getUser);
userRouter.put("/user/:userId/", UserController.updateUser);
userRouter.get("/user/:userId/photos", UserController.getPhotosByUserId);
userRouter.post(
  "/user/:userId/photo-uploaded",
  UserController.handlePhotoUploaded
);

export default userRouter;

