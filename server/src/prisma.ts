import { PrismaClient, Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

export const UserOmitArgs = {
  loginToken: true,
  wechatOpenId: true,
  phoneNumber: true,
  updatedAt: true,
  createdAt: true,
};

export const prisma = new PrismaClient({
  omit: {
    user: UserOmitArgs,
  },
}).$extends({
  result: {
    user: {
      isProfileComplete: {
        compute(data) {
          return Boolean(
            data.name &&
              data.jobTitle &&
              data.gender &&
              data.graduatedFrom &&
              data.dateOfBirth &&
              data.height &&
              data.hometown
          );
        },
      },
      isBioComplete: {
        compute(data) {
          return Object.values(data.bio).filter((v) => v).length > 1;
        },
      },
      age: {
        compute(data) {
          if (!data.dateOfBirth) return null;
          const [birthYear, birthMonth, birthDay] = data.dateOfBirth
            .split("/")
            .map(Number);

          const today = new Date();
          const currentMonth = today.getMonth() + 1; // getMonth() returns 0-11
          const currentYear = today.getFullYear();
          const currentDay = today.getDate();

          let age = currentYear - birthYear;

          // Check if birthday hasn't occurred this year
          if (
            currentMonth < birthMonth ||
            (currentMonth === birthMonth && currentDay < birthDay)
          ) {
            age--;
          }

          return age;
        },
      },
      zodiacSign: {
        compute(data) {
          if (!data.dateOfBirth) return null;
          const [, birthMonth, birthDay] = data.dateOfBirth
            .split("/")
            .map(Number);
          return getWesternZodiac(birthMonth, birthDay);
        },
      },
    },
  },
  model: {
    user: {
      async init(params: Prisma.userCreateInput) {
        if (!params.phoneNumber && !params.wechatOpenId) {
          throw new Error("手机号和微信号至少填写一个");
        }

        return prisma.user.create({
          data: {
            ...params,
            bio: params.bio ?? {
              关于我: "",
              我的理想型: "",
              // 最理想的周末: "",
            },
            loginToken: Prisma.getExtensionContext(this).setLoginToken(
              params.phoneNumber ?? params.wechatOpenId
            ),
          },
        });
      },
      setLoginToken(identifier: string) {
        return jwt.sign(identifier, process.env.API_USER_TOKEN_SECRET);
      },
    },
  },
});

const getWesternZodiac = (month: number, day: number) => {
  const signs = [
    { name: "摩羯座", startDate: [1, 1], endDate: [1, 19] },
    { name: "水瓶座", startDate: [1, 20], endDate: [2, 18] },
    { name: "双鱼座", startDate: [2, 19], endDate: [3, 20] },
    { name: "白羊座", startDate: [3, 21], endDate: [4, 19] },
    { name: "金牛座", startDate: [4, 20], endDate: [5, 20] },
    { name: "双子座", startDate: [5, 21], endDate: [6, 20] },
    { name: "巨蟹座", startDate: [6, 21], endDate: [7, 22] },
    { name: "狮子座", startDate: [7, 23], endDate: [8, 22] },
    { name: "处女座", startDate: [8, 23], endDate: [9, 22] },
    { name: "天秤座", startDate: [9, 23], endDate: [10, 22] },
    { name: "天蝎座", startDate: [10, 23], endDate: [11, 21] },
    { name: "射手座", startDate: [11, 22], endDate: [12, 21] },
    { name: "摩羯座", startDate: [12, 22], endDate: [12, 31] },
  ];

  const date = new Date(2000, month - 1, day);
  for (let sign of signs) {
    const start = new Date(2000, sign.startDate[0] - 1, sign.startDate[1]);
    const end = new Date(2000, sign.endDate[0] - 1, sign.endDate[1]);
    if (date >= start && date <= end) {
      return sign.name;
    }
  }
  return "未知";
};

