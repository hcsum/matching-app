import { RequestHandler } from "express";
import { prisma } from "../prisma";

export const alipayNotify: RequestHandler = async (req, res) => {
  const { trade_no, trade_status, total_amount, out_trade_no } = req.body;
  console.log(
    "alipay notify",
    trade_no,
    trade_status,
    total_amount,
    out_trade_no
  );
  // 2024091522001479571454150149 TRADE_SUCCESS 0.01 7a4504ae-1f49-4d31-924c-900ca301443e
  res.send("success");

  const order = await prisma.order.findUnique({
    where: { id: out_trade_no },
  });

  if (!order || total_amount !== order.amount.toString()) {
    throw new Error(`Invalid alipay notification: ${JSON.stringify(req.body)}`);
  }

  if (trade_status !== "TRADE_SUCCESS") {
    return;
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "PAID" },
  });

  await prisma.participant.create({
    data: {
      userId: order.userId,
      matchingEventId: order.eventId,
    },
  });
};

