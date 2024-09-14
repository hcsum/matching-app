import { RequestHandler } from "express";

export const alipayNotify: RequestHandler = async (req, res) => {
  const { trade_no, trade_status, total_amount, out_trade_no } = req.query;
  console.log(
    "alipay notify",
    trade_no,
    trade_status,
    total_amount,
    out_trade_no
  );
  res.status(200).end();
};

