import express from "express";
import { UserController } from "../controller";

const userRouter = express.Router();

userRouter.post("/user/upsert", UserController.upsertUser);
userRouter.get("/user/:userId", UserController.getUser);
userRouter.put("/user/:userId/", UserController.updateUser);

export default userRouter;
