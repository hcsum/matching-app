import { PrismaClient, Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

export const prisma = new PrismaClient().$extends({
  result: {
    user: {
      hasValidProfile: {
        compute(data) {
          return Boolean(
            data.name &&
              data.jobTitle &&
              data.gender &&
              data.graduatedFrom &&
              data.monthAndYearOfBirth &&
              Object.values(data.bio).every((value) => value !== null)
          );
        },
      },
      age: {
        compute(data) {
          if (!data.monthAndYearOfBirth) return null;
          const [birthYear, birthMonth] = data.monthAndYearOfBirth
            .split("/")
            .map(Number);

          const today = new Date();
          const currentMonth = today.getMonth() + 1; // getMonth() returns 0-11
          const currentYear = today.getFullYear();

          let age = currentYear - birthYear;

          if (currentMonth < birthMonth) {
            age--;
          }

          return age;
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

