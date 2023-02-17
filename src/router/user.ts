import express from "express";
import { UserController } from "../controller";

const userRouter = express.Router();
import multer from 'multer'

const upload = multer({ dest: 'uploads/' });

userRouter.post("/user/upsert", UserController.upsertUser);
userRouter.get("/user/:userId", UserController.getUser);
userRouter.put("/user/:userId/", UserController.updateUser);
userRouter.post("/user/:userId/cos-location", UserController.uploadUserPhoto); 
userRouter.all("/user/:userId/sts", UserController.getCosCredential);





export default userRouter;

 