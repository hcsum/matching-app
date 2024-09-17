import express from "express";
import { MatchingEventController, UserController } from "../controller";

const userRouter = express.Router();

userRouter.post("/user/phone-code", UserController.sendPhoneVerificationCode);
userRouter.post("/user/login-or-signup", UserController.loginOrSignupUser);
userRouter.get("/user/wechat-login", UserController.loginOrSignupByWechat);
userRouter.get("/user/me", UserController.getUserByAccessToken);

userRouter.use("/user/", UserController.userGuard);

userRouter.get(
  "/user/matching-events",
  MatchingEventController.getUserParticipatedMatchingEvents
);
userRouter.put("/user/profile", UserController.updateUserProfile);
userRouter.delete("/user/photo/:photoId", UserController.deletePhoto);
userRouter.get("/user/photos", UserController.getPhotosByUserId);
userRouter.post("/user/photo-uploaded", UserController.handlePhotoUploaded);

export default userRouter;

