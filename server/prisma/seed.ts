import usersData from "./mocks/users.json";
import { prisma } from "../src/prisma";

async function seed() {
  try {
    const usersMale = [];
    const usersFemale = [];
    for (const userData of usersData) {
      const { photos, ...rest } = userData;
      const user = await prisma.user.init(rest);
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

    // 模拟选择坚持的用户
    const noVoteUser = await prisma.user.init({
      gender: "male",
      jobTitle: "管理员",
      name: "要坚强",
      phoneNumber: "18520555555",
      graduatedFrom: "清北大学",
      monthAndYearOfBirth: "1998/01",
      bio: {
        关于我: "嗨, 我是要坚强",
        我的理想型: "是个好人",
      },
    });
    // 模拟选择反选的用户
    const noMatchUserWithVotes = await prisma.user.init({
      gender: "female",
      jobTitle: "模特",
      graduatedFrom: "某名牌大学",
      name: "可爱珍",
      phoneNumber: "18520211227",
      monthAndYearOfBirth: "1995/01",
      bio: {
        关于我: "嗨, 我是可爱珍",
        我的理想型: "爹系男友",
      },
      photos: {
        create: {
          cosLocation:
            "matching-app-user-1258131142.cos.ap-guangzhou.myqcloud.com/images/6b4feb04-1eb9-4770-b4ad-3d0ea843a2f7/1727172864356-b25eab17dcb43588681456788bf1f1.jpg",
        },
      },
    });
    // 未参加活动的用户
    await prisma.user.init({
      gender: "female",
      jobTitle: "路人",
      monthAndYearOfBirth: "1993/01",
      name: "小冰",
      phoneNumber: "18520811449",
    });

    const users = usersMale.concat(usersFemale, [
      noVoteUser,
      noMatchUserWithVotes,
    ]);

    // generate matching events
    const newEvent1 = await prisma.matching_event.create({
      data: {
        id: "1aaaaaaa-bbbb-4ccc-9ddd-eeeeeeeeeeee",
        title: "单身交友｜enrolling 三天CP，「 寻找另一个自己 」",
        choosingStartsAt: new Date("2024-11-01"),
        matchingStartsAt: new Date("2024-11-05"),
        phase: "ENROLLING",
      },
    });
    const newEvent2 = await prisma.matching_event.create({
      data: {
        id: "2aaaaaaa-bbbb-4ccc-9ddd-eeeeeeeeeeee",
        title: "单身交友｜choosing 三天CP，「 寻找另一个自己 」",
        choosingStartsAt: new Date("2024-09-05"),
        matchingStartsAt: new Date("2024-09-10"),
        phase: "CHOOSING",
      },
    });
    const newEvent3 = await prisma.matching_event.create({
      data: {
        id: "3aaaaaaa-bbbb-4ccc-9ddd-eeeeeeeeeeee",
        title: "单身交友｜matching 三天CP，「 寻找另一个自己 」",
        choosingStartsAt: new Date("2024-08-20"),
        matchingStartsAt: new Date("2024-08-25"),
        phase: "MATCHING",
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
    for (let user of [...usersMale, noVoteUser]) {
      for (let event of [newEvent1, newEvent2, newEvent3]) {
        const tempUsers = [...usersFemale, noMatchUserWithVotes]; // todo: can't guarantee noMatchUserWithVotes will always get picked
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

