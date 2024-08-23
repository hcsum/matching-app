import express from "express";
import matchingEventRouter from "./matching-event";
import userRouter from "./user";
import { getCosCredential } from "../controller";
import { getWechatSignature } from "../controller/wechat";

const apiRouter = express.Router();

apiRouter.get("/health", (req, res) => res.send("ok"));
apiRouter.use(userRouter);
apiRouter.use(matchingEventRouter);
apiRouter.get("/cos/sts", getCosCredential);
apiRouter.post("/wechat/signature", getWechatSignature);

export default apiRouter;

