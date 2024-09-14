import { RequestHandler } from "express";

export const alipayNotify: RequestHandler = async (req, res) => {
  // const { trade_no, trade_status, total_amount, out_trade_no } = req.query;
  // const { trade_no, trade_status, total_amount, out_trade_no } = req.body;
  // console.log(
  //   "alipay notify",
  //   trade_no,
  //   trade_status,
  //   total_amount,
  //   out_trade_no
  // );
  // console.log("alipay notify", req.res);
  console.log("Webhook body:", req.body);
  console.log("Webhook query:", req.query);
  console.log("Webhook params:", req.params);
  res.sendStatus(200);
};

