import { RequestHandler } from "express";
import AppDataSource from "./dataSource";
import { MatchingEvent } from "./domain/matching-event/model";
import { Picking } from "./domain/picking/model";
import { User } from "./domain/user/model";

export const seedData: RequestHandler = async (req, res) => {
  // const event = MatchingEvent.init({ startedAt: new Date(), title: "快来吧" });
  // await AppDataSource.manager.save(event);

  // const users = await AppDataSource.manager.find(User);
  // event.participants = users;
  // const event = await AppDataSource.manager.findOne(MatchingEvent, {
  //   where: { id: "185150ca-405d-4955-b4a3-c31bab3576fa" },
  // });
  // const users = await AppDataSource.manager.find(User);

  // const picking1 = Picking.init({
  //   matchingEvent: event.id,
  //   madeByUser: users[0],
  //   pickedUser: users[1],
  // });
  // const picking2 = Picking.init({
  //   matchingEvent: event.id,
  //   madeByUser: users[1],
  //   pickedUser: users[2],
  // });

  // const picking1 = await AppDataSource.manager.findBy(Picking, {
  //   madeByUser: users[0],
  // });

  // await AppDataSource.manager.save(picking1);
  // await AppDataSource.manager.save(picking2);

  res.send("ok");
};
