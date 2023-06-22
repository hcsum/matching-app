import express from "express";
import { MatchingEventController, UserController } from "../controller";

const userRouter = express.Router();

userRouter.post("/user/phone-code", UserController.sendPhoneVerificationCode);
userRouter.post("/user/login-or-signup", UserController.loginOrSignupUser);

userRouter.use("/user/:userId", UserController.userGuard);

userRouter.get(
  "/user/:userId/matching-events",
  MatchingEventController.getMatchingEventsByUserId
);
userRouter.get("/user/:userId", UserController.getUser);
userRouter.put("/user/:userId/profile", UserController.updateUserProfile);
userRouter.get("/user/:userId/photos", UserController.getPhotosByUserId);
userRouter.post(
  "/user/:userId/photo-uploaded",
  UserController.handlePhotoUploaded
);

export default userRouter;

