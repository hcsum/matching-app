import cookieParser from "cookie-parser";

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import AppDataSource from "./data-source";
import apiRouter from "./router";
import fileRouter from "./file-router";

const port = process.env.PORT;
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
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      credentials: true,
      origin: ["http://localhost:3000"],
    })
  );
}

app.get("/health", (req, res) => res.send("ok"));

app.use("/api", apiRouter);

app.get("/*", fileRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error caught:", err.message);
  console.error(err.stack);
  if (err.message.includes("no such file or directory")) {
    return res.status(404).send("Not Found");
  }
  res.status(500).send("Error");
});

app.listen(port, () => {
  connectToDB().then(() => console.log(`App listening on port ${port}`));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught error:", err);
  console.log("Node NOT Exiting...");
});

