import usersData from "./mocks/users.json";
import { prisma } from "../src/prisma";

async function seed() {
  try {
    const usersMale = [];
    const usersFemale = [];
    for (const userData of usersData) {
      const user = await prisma.user.init(userData);
      user.gender === "male" ? usersMale.push(user) : usersFemale.push(user);

      if (userData.photos) {
        for (const p of userData.photos) {
          await prisma.photo.create({
            data: {
              cosLocation: p,
              userId: user.id,
            },
          });
        }
      }
    }
    const users = usersMale.concat(usersFemale);

    const noEventUser = await prisma.user.init({
      gender: "male",
      jobTitle: "有钱人",
      name: "新人",
      phoneNumber: "18520555555",
      bio: {
        关于我: "嗨，我还没参加活动呢",
        我的理想型: "她腰臀比要好",
      },
    });

    // generate matching events
    const newEvent1 = await prisma.matching_event.create({
      data: {
        title: "单身交友｜enrolling 三天CP，「 寻找另一个自己 」",
        startChoosingAt: new Date("2024-11-01"),
        phase: "enrolling",
      },
    });
    const newEvent2 = await prisma.matching_event.create({
      data: {
        title: "单身交友｜choosing 三天CP，「 寻找另一个自己 」",
        startChoosingAt: new Date("2024-09-05"),
        phase: "choosing",
      },
    });
    const newEvent3 = await prisma.matching_event.create({
      data: {
        title: "单身交友｜matching 三天CP，「 寻找另一个自己 」",
        startChoosingAt: new Date("2024-08-20"),
        phase: "matching",
      },
    });

    // generate participants
    const participantsEvent1 = users.map((user) => ({
      userId: user.id,
      matchingEventId: newEvent1.id,
    }));
    const participantsEvent2 = users.map((user) => ({
      userId: user.id,
      matchingEventId: newEvent2.id,
    }));
    const participantsEvent3 = users.map((user) => ({
      userId: user.id,
      matchingEventId: newEvent3.id,
    }));
    await prisma.participant.createMany({
      data: [
        ...participantsEvent1,
        ...participantsEvent2,
        ...participantsEvent3,
      ],
    });

    // generate pickings
    for (let user of usersMale) {
      for (let event of [newEvent1, newEvent2, newEvent3]) {
        const tempUsers = [...usersFemale];
        for (let i = 0; i < 3; i++) {
          try {
            const idx = Math.floor(Math.random() * tempUsers.length);

            await prisma.picking.create({
              data: {
                matchingEventId: event.id,
                pickedUserId: tempUsers[idx].id,
                madeByUserId: user.id,
              },
            });

            tempUsers.splice(idx, 1);
          } catch (err) {
            console.log("fail to make picking", err);
          }
        }
      }
    }

    for (let user of usersFemale) {
      for (let event of [newEvent1, newEvent2, newEvent3]) {
        const tempUsers = [...usersMale];
        for (let i = 0; i < 3; i++) {
          try {
            const idx = Math.floor(Math.random() * tempUsers.length);

            await prisma.picking.create({
              data: {
                matchingEventId: event.id,
                pickedUserId: tempUsers[idx].id,
                madeByUserId: user.id,
              },
            });

            tempUsers.splice(idx, 1);
          } catch (err) {
            console.log("fail to make picking", err);
          }
        }
      }
    }

    console.log("seeded data successfully");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

