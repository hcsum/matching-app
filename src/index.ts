import express, { NextFunction } from "express";
import { getTradingInfo } from "./services/TradingInfo";
import cors from "cors";
import { mockApiCall } from "./utils/mocks";
import { cacheRequest } from "./utils/cacheRequest";
import { Pool } from "pg";
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432")
});

export type TradingInfo = {
  name: string;
  priceUsd: string;
  volumeUsd24Hr: string;
  changePercent24Hr: string;
};

const connectToDB = async () => {
  try {
    await pool.connect();
  } catch (err) {
    console.log(err);
  }
};


const app = express();
const port = process.env.PORT;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello!!!");
});

const cachedGetTradingInfo = cacheRequest(5000, () => {
  console.log("I actually called");
  // return getTradingInfo();
  return mockApiCall();
});

app.get("/tradingInfo", async (req, res, next) => {
  const result = await cachedGetTradingInfo().catch(next);
  res.send(result);
});

app.use((err: Error, req: any, res: any, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("error");
});

app.listen(port, () => {
  connectToDB().then(() => 
    console.log(`App listening on port ${port}`)
  ).catch(err => console.log(err));
});
