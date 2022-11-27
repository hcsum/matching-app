import express, { NextFunction } from "express";
import { getTradingInfo } from "./services/TradingInfo";
import cors from "cors";
import { mockApiCall } from "./utils/mocks";
import { cacheRequest } from "./utils/cacheRequest";

export type TradingInfo = {
  name: string;
  priceUsd: string;
  volumeUsd24Hr: string;
  changePercent24Hr: string;
};

const app = express();
const port = 4000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
});

const cachedGetTradingInfo = cacheRequest(5000, () => {
  console.log("I actually called");
  return getTradingInfo();
  // return mockApiCall();
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
  console.log(`App listening on port ${port}`);
});
