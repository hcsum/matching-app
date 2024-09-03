import express from "express";
import matchingEventRouter from "./matching-event";
import userRouter from "./user";
import { getCosCredential } from "../controller";
import { wechatAdapter } from "..";

const apiRouter = express.Router();

apiRouter.get("/health", (req, res) => res.send("ok"));
apiRouter.use(userRouter);
apiRouter.use(matchingEventRouter);
apiRouter.get("/cos/sts", getCosCredential);
apiRouter.post("/wechat/signature", async (req, res) => {
  const result = await wechatAdapter.getSignature({
    url: req.body.url,
  });
  res.send(result);
});

export default apiRouter;

