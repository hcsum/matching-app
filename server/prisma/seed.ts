import AppDataSource from "../src/data-source";
import { MatchingEvent } from "../src/domain/matching-event/model";
import { Picking } from "../src/domain/picking/model";
import { User } from "../src/domain/user/model";
import { Photo } from "../src/domain/photo/model";
import { Participant } from "../src/domain/participant/model";

async function seed() {
  await AppDataSource.initialize();

  // generate users
  const usersData = require("./mocks/users.json");
  const usersMale: User[] = [];
  const usersFemale: User[] = [];
  for (const userData of usersData) {
    const user = User.init(userData);
    user.update({ bio: userData.bio });
    const savedUser = await AppDataSource.manager.save(user);
    user.gender === "male"
      ? usersMale.push(savedUser)
      : usersFemale.push(savedUser);

    userData.photos?.forEach(async (p: string) => {
      const photo = Photo.init({ url: p, user: savedUser });
      await AppDataSource.manager.save(photo);
    });
  }
  const users = usersMale.concat(usersFemale);
  const noEventUser = User.init({
    age: 28,
    gender: "male",
    jobTitle: "有钱人",
    name: "新人",
    phoneNumber: "18520555555",
  });
  noEventUser.update({
    bio: {
      关于我: "嗨，我还没参加活动呢",
      我的理想型: "她腰臀比要好",
    },
  });
  await AppDataSource.manager.save(noEventUser);

  // generate matching events
  const newEvent1 = MatchingEvent.init({
    title: "单身交友｜enrolling 三天CP，「 寻找另一个自己 」",
    startChoosingAt: new Date("2024-11-01"),
    phase: "enrolling",
  });
  const newEvent2 = MatchingEvent.init({
    title: "单身交友｜choosing 三天CP，「 寻找另一个自己 」",
    startChoosingAt: new Date("2024-09-05"),
    phase: "choosing",
  });
  const newEvent3 = MatchingEvent.init({
    title: "单身交友｜matching 三天CP，「 寻找另一个自己 」",
    startChoosingAt: new Date("2024-08-20"),
    phase: "matching",
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
  for (let user of usersMale) {
    for (let event of [event1, event2, event3]) {
      const tempUsers = [...usersFemale];
      for (let i = 0; i < 3; i++) {
        try {
          const idx = Math.floor(Math.random() * tempUsers.length);

          const picking = Picking.init({
            matchingEventId: event.id,
            pickedUserId: tempUsers[idx].id,
            madeByUserId: user.id,
          });

          await AppDataSource.manager.save(picking);

          tempUsers.splice(idx, 1);
        } catch (err) {
          console.log("fail to make picking", err);
        }
      }
    }
  }

  for (let user of usersFemale) {
    for (let event of [event1, event2, event3]) {
      const tempUsers = [...usersMale];
      for (let i = 0; i < 3; i++) {
        try {
          const idx = Math.floor(Math.random() * tempUsers.length);

          const picking = Picking.init({
            matchingEventId: event.id,
            pickedUserId: tempUsers[idx].id,
            madeByUserId: user.id,
          });

          await AppDataSource.manager.save(picking);

          tempUsers.splice(idx, 1);
        } catch (err) {
          console.log("fail to make picking", err);
        }
      }
    }
  }

  await AppDataSource.destroy();
}

seed()
  .then(() => console.log("seeded data successfully"))
  .catch((error) => console.error(error));
