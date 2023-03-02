import * as dotenv from 'dotenv'  
dotenv.config()

import express, { NextFunction } from "express";
import cors from "cors";
import AppDataSource from "./data-source";
import bodyParser from "body-parser";
import apiRouter from "./router";

 
const port = process.env.PORT;
const connectToDB = async () => {
  return AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });
};

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => res.send("Hello!"));

app.use("/api", apiRouter);

app.use((err: Error, req: any, res: any, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("error");
});

app.listen(port, () => {
  connectToDB().then(() => console.log(`App listening on port ${port}`));
});

process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});
