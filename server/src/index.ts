import cookieParser from "cookie-parser";

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import AppDataSource from "./data-source";
import apiRouter from "./router";

const port = process.env.API_CONTAINER_PORT;
const connectToDB = async () =>
  AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    credentials: true,
    origin:
      process.env.NODE_ENV === "development"
        ? "*"
        : ["https://luudii.com", "https://www.luudii.com"],
  })
);

app.get("/health", (req, res) => res.send("ok"));

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
  connectToDB().then(() => console.log(`App listening on port ${port}`));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught error:", err);
  console.log("Node NOT Exiting...");
});

