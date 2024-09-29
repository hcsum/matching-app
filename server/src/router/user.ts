import express from "express";
import { MatchingEventController, UserController } from "../controller";

const userRouter = express.Router();

userRouter.post("/phone-code", UserController.sendPhoneVerificationCode);
userRouter.post("/login-or-signup", UserController.loginOrSignupUser);
userRouter.get("/wechat-login", UserController.loginOrSignupByWechat);
userRouter.get("/me", UserController.getUserByAccessToken);

userRouter.use("/:userId", UserController.userGuard);

userRouter.get(
  "/:userId/matching-events",
  MatchingEventController.getMatchingEventsByUserId
);
userRouter.put("/:userId/profile", UserController.updateUserProfile);
userRouter.delete("/:userId/photo/:photoId", UserController.deletePhoto);
userRouter.post("/:userId/photo-uploaded", UserController.handlePhotoUploaded);

export default userRouter;

