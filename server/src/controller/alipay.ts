import { RequestHandler } from "express";
import { prisma } from "../prisma";

// todo: validate alipay notification
export const alipayNotify: RequestHandler = async (req, res) => {
  const { trade_no, trade_status, total_amount, out_trade_no } = req.body;
  console.log(
    "alipay notify",
    trade_no,
    trade_status,
    total_amount,
    out_trade_no
  );
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

