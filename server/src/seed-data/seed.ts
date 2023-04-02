/* eslint-disable global-require */
import AppDataSource from "../data-source";
import { MatchingEvent } from "../domain/matching-event/model";
import { Picking } from "../domain/picking/model";
import { User } from "../domain/user/model";

async function seed() {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);
  const usersData = require("./users.json");
  const users: User[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const userData of usersData) {
    const user = User.init(userData);
    // eslint-disable-next-line no-await-in-loop
    users.push(await userRepository.save(user));
  }

  const newEvent = MatchingEvent.init({
    title: "三天cp第一期",
  });
  newEvent.participants = users;
  newEvent.id = "36cffe10-3f93-40f3-96be-26cb42399955";
  newEvent.setPhase("choosing");
  const event = await AppDataSource.manager.save(newEvent);

  const picking1 = Picking.init({
    matchingEventId: event.id,
    madeByUserId: users[0].id,
    pickedUserId: users[1].id,
  });
  const picking2 = Picking.init({
    matchingEventId: event.id,
    madeByUserId: users[1].id,
    pickedUserId: users[2].id,
  });

  await AppDataSource.manager.save(picking1);
  await AppDataSource.manager.save(picking2);

  await AppDataSource.destroy();
}

seed()
  .then(() => console.log("seeded data successfully"))
  .catch((error) => console.error(error));

