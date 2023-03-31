/* eslint-disable import/first */
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
// https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import AppDataSource from "./data-source";
import apiRouter from "./router";

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
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.get("/", (req, res) => res.send("Hello!"));

app.use("/api", apiRouter);

app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).send("error");
});

app.listen(port, () => {
  connectToDB().then(() => console.log(`App listening on port ${port}`));
});

process.on("uncaughtException", (err) => {
  console.error(err);
  console.log("Node NOT Exiting...");
});

