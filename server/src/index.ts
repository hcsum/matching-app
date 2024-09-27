require("express-async-errors");
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import apiRouter from "./router";
import WechatAdapter from "./adapter/wechat";
import AlipayAdapter from "./adapter/alipay";

const port = process.env.API_CONTAINER_PORT;

const app = express();
export const aliPayAdapter = new AlipayAdapter({
  appId: process.env.ALIPAY_APP_ID ?? "",
  privateKey: fs.readFileSync(
    path.resolve(__dirname, "../credentials/alipay-private.pem"),
    "ascii"
  ),
  alipayPublicKey: fs.readFileSync(
    path.resolve(__dirname, "../credentials/alipayPublicKey_RSA2.txt"),
    "ascii"
  ),
});
export const wechatAdapter = new WechatAdapter({
  appid: process.env.TENCENT_WECHAT_APP_ID ?? "",
  appsecret: process.env.TENCENT_WECHAT_APP_SECRET ?? "",
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin:
      process.env.NODE_ENV === "development"
        ? "*"
        : ["https://ludigi.work", "https://www.ludigi.work"],
  })
);

app.use("/api", apiRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error caught:", err.message);
  console.error(err.stack);
  if (err.message.includes("no such file or directory")) {
    return res.status(404).send("Not Found");
  }
  res.status(500).send(err.message ?? "Error");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught error:", err);
  console.log("Node NOT Exiting...");
});

