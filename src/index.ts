import express, { NextFunction } from "express";
import cors from "cors";
import AppDataSource from "./dataSource";
import UserRepository from "./domain/user/repository";
import bodyParser from "body-parser";
import { User } from "./domain/user/model";
import { MatchingEvent } from "./domain/matching-event/model";
import { Picking } from "./domain/picking/model";

const port = process.env.PORT;

const connectToDB = async () => {
  return AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .then(async () => {})
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });
};

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/seed", async (req, res) => {
  // const event = MatchingEvent.init({ startedAt: new Date(), title: "快来吧" });
  // const users = await AppDataSource.manager.find(User);
  // event.participants = users;
  // await AppDataSource.manager.save(event);
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
});

app.get("/pickings/:userId", async (req, res, next) => {
  const { userId } = req.params;
  const query = AppDataSource.getRepository(Picking)
    .createQueryBuilder("picking")
    // .leftJoinAndSelect("picking.madeByUser", "madeByUser")
    .leftJoinAndSelect("picking.pickedUser", "pickedUser")
    .where("picking.madeByUser = :id", { id: userId });

  console.log("query", query.getQuery());

  const pickings = await query.getMany();

  res.send(pickings);
});

app.get("/pickedBys/:userId", async (req, res, next) => {
  console.log("req query", req.params);
  res.send("ok");
});

app.get("/user/:userId", async (req, res, next) => {
  const result = await UserRepository.findBy({ id: req.params.userId });
  res.send(result);
});

app.use((err: Error, req: any, res: any, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("error");
});

app.listen(port, () => {
  connectToDB().then(() => console.log(`App listening on port ${port}`));
});
