import express from "express";
import matchingEventRouter from "./matching-event";
import userRouter from "./user";
import adminRouter from "./admin";
import { AdminController, getCosCredential } from "../controller";
import { wechatAdapter } from "..";
import { alipayNotify } from "../controller/alipay";

const apiRouter = express.Router();

apiRouter.get("/health", (req, res) => res.send("ok"));
apiRouter.use("/user", userRouter);
apiRouter.use("/matching-event", matchingEventRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.get("/cos/sts", getCosCredential);
apiRouter.post("/alipay/notify", alipayNotify);
apiRouter.post("/wechat/signature", async (req, res) => {
  const result = await wechatAdapter.getSignature({
    url: req.body.url,
  });
  res.send(result);
});

export default apiRouter;

