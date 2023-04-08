import AppDataSource from "../data-source";
import { MatchingEvent } from "../domain/matching-event/model";
import { Picking } from "../domain/picking/model";
import { User } from "../domain/user/model";
import { Photo } from "../domain/photo/model";
import { Participant } from "../domain/participant/model";

async function seed() {
  await AppDataSource.initialize();

  // generate users
  const usersData = require("./users.json");
  const users: User[] = [];
  for (const userData of usersData) {
    const user = User.init(userData);
    user.update({ bio: userData.bio });
    const savedUser = await AppDataSource.manager.save(user);
    users.push(savedUser);

    userData.photos?.forEach(async (p: string) => {
      const photo = Photo.init({ url: p, user: savedUser });
      await AppDataSource.manager.save(photo);
    });
  }

  // generate matching events
  const newEvent1 = MatchingEvent.init({
    title: "三天cp第一期",
    startChoosingAt: new Date("2023-01-01"),
    phase: "ended",
  });
  const newEvent2 = MatchingEvent.init({
    title: "三天cp第二期",
    startChoosingAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    phase: "choosing",
  });
  const newEvent3 = MatchingEvent.init({
    title: "三天cp第三期",
    startChoosingAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    phase: "enrolling",
  });
  const event1 = await AppDataSource.manager.save(newEvent1);
  const event2 = await AppDataSource.manager.save(newEvent2);
  const event3 = await AppDataSource.manager.save(newEvent3);

  // generate participants
  const participantsEvent1 = users.map((user) =>
    Participant.init({ userId: user.id, matchingEventId: event1.id })
  );
  const participantsEvent2 = users.map((user) =>
    Participant.init({ userId: user.id, matchingEventId: event2.id })
  );
  const participantsEvent3 = users.map((user) =>
    Participant.init({ userId: user.id, matchingEventId: event3.id })
  );
  await AppDataSource.manager.save(participantsEvent1);
  await AppDataSource.manager.save(participantsEvent2);
  await AppDataSource.manager.save(participantsEvent3);

  // generate pickings
  const picking1 = Picking.init({
    matchingEventId: event3.id,
    madeByUserId: users[0].id,
    pickedUserId: users[1].id,
  });
  const picking2 = Picking.init({
    matchingEventId: event3.id,
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

