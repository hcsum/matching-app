import { RequestHandler } from "express";
import AppDataSource from "./dataSource";
import { MatchingEvent } from "./domain/matching-event/model";
import { Picking } from "./domain/picking/model";
import { User } from "./domain/user/model";

export const seedData: RequestHandler = async (req, res) => {
  const user1 = User.init({
    age: 26,
    gender: "female",
    jobTitle: "BD",
    name: "May",
    phoneNumber: "18723490888",
  });
  const user2 = User.init({
    age: 30,
    gender: "male",
    jobTitle: "coder",
    name: "Charles",
    phoneNumber: "18733456890",
  });
  const user3 = User.init({
    age: 33,
    gender: "female",
    jobTitle: "PR",
    name: "Jane",
    phoneNumber: "19092490888",
  });

  const users = await Promise.all([
    AppDataSource.manager.save(user1),
    AppDataSource.manager.save(user2),
    AppDataSource.manager.save(user3),
  ]);
  // const users = await AppDataSource.manager.find(User);
  const newEvent = MatchingEvent.init({
    startedAt: new Date(),
    title: "快来吧",
  });
  const event = await AppDataSource.manager.save(newEvent);
  event.participants = users;
  // const event = await AppDataSource.manager.findOne(MatchingEvent, {
  //   where: { id: "185150ca-405d-4955-b4a3-c31bab3576fa" },
  // });
  // const users = await AppDataSource.manager.find(User);

  const picking1 = Picking.init({
    matchingEvent: event.id,
    madeByUser: users[0],
    pickedUser: users[1],
  });
  const picking2 = Picking.init({
    matchingEvent: event.id,
    madeByUser: users[1],
    pickedUser: users[2],
  });

  // const picking1 = await AppDataSource.manager.findBy(Picking, {
  //   madeByUser: users[0],
  // });

  await AppDataSource.manager.save(picking1);
  await AppDataSource.manager.save(picking2);

  res.send("ok");
};
