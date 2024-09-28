import { RequestHandler } from "express";

import SmsAdapter from "../adapter/sms";
import {
  generateVerificationCode,
  getCodeByPhoneNumber,
  verifyVerificationCode,
} from "../helper/phone-verification-code-cache";
import { wechatAdapter } from "..";
import { prisma } from "../prisma";

// need better way to do DI
const smsAdapter = new SmsAdapter();

export const loginOrSignupByWechat: RequestHandler = async (req, res) => {
  const { code, eventId } = req.query;
  if (!code || typeof eventId !== "string") {
    res.status(400).json({ message: "missing code or eventId" });
    return;
  }
  const { access_token, openid } = await wechatAdapter.getUserAccessToken(
    code as string
  );

  const userInfo = await wechatAdapter.getUserInfo(access_token, openid);
  const user =
    (await prisma.user.findUnique({ where: { wechatOpenId: openid } })) ??
    (await prisma.user.init({
      wechatOpenId: openid,
      name: userInfo.nickname,
      // gender:
      //   userInfo.sex === 0 ? "male" : userInfo.sex === 1 ? "female" : undefined,
    }));

  if (!user) {
    res.status(400).json({ message: "user not found" });
    return;
  }

  const event = await prisma.matching_event.findUniqueOrThrow({
    where: {
      id: eventId,
    },
  });

  res.redirect(
    `https://ludigi.work/matching-event/${event.id}?access_token=${user.loginToken}`
  );
};

export const loginOrSignupUser: RequestHandler = async (req, res, next) => {
  const { phoneNumber, code, eventId } = req.body as {
    code: string;
    phoneNumber: string;
    eventId: string;
  };

  if (!verifyVerificationCode(phoneNumber, code))
    return res.status(400).json({ error: "fail to verify" });

  let user =
    (await prisma.user.findUnique({
      where: {
        phoneNumber,
      },
    })) ??
    (await prisma.user.init({
      phoneNumber,
    }));

  // await prisma.participant.upsert({
  //   where: {
  //     userId_matchingEventId: {
  //       userId: user.id,
  //       matchingEventId: eventId,
  //     },
  //   },
  //   update: {},
  //   create: {
  //     userId: user.id,
  //     matchingEventId: eventId,
  //   },
  // });

  res.cookie("token", user.loginToken);
  res.header("Access-Control-Allow-Credentials", "true"); // why not useful
  res.status(201).json(user);
};

export const getUserByAccessToken: RequestHandler = async (req, res) => {
  const authHeader = req.headers.authorization;
  const user = await prisma.user.findUnique({
    where: { loginToken: authHeader },
    include: {
      photos: true,
    },
  });
  if (!user) {
    res.status(404).json({ error: "user not found" });
    return;
  }

  const events = await prisma.matching_event.findMany({
    where: {
      participants: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  delete user.loginToken;
  res.json({
    ...user,
    isPhotosComplete: user.photos.length >= 1,
    eventIds: events.map((e) => e.id),
  });
};

export const updateUserProfile: RequestHandler = async (req, res, next) => {
  const values = req.body;
  const user = req.ctx!.user;

  if (values.gender && user.gender) {
    delete values.gender;
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: values,
  });

  res.json(updatedUser);
};

export const handlePhotoUploaded: RequestHandler = async (req, res, next) => {
  const { cosLocation } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.ctx!.user.id },
  });
  const photo = await prisma.photo.create({
    data: {
      cosLocation,
      userId: user.id,
    },
  });
  res.json({
    id: photo.id,
    cosLocation: photo.cosLocation,
  });
};

export const getPhotosByUserId: RequestHandler = async (req, res, next) => {
  const photos = await prisma.photo.findMany({
    where: {
      userId: req.ctx!.user.id,
    },
    include: {
      user: true,
    },
  });
  res.json(photos);
};

export const sendPhoneVerificationCode: RequestHandler = async (
  req,
  res,
  next
) => {
  const { phoneNumber } = req.body;

  if (getCodeByPhoneNumber(phoneNumber))
    return res.status(400).json({ error: "code not expire yet" });

  const code = generateVerificationCode(phoneNumber);

  if (process.env.NODE_ENV === "development") {
    return res.json(code);
  }

  await smsAdapter
    .sendLoginVerificationCode({
      phone: phoneNumber,
      code,
    })
    .catch(next);

  res.json("ok");
};

export const deletePhoto: RequestHandler = async (req, res, next) => {
  const { photoId } = req.params;
  await prisma.photo.delete({
    where: { id: photoId },
  });
  res.sendStatus(200);
};

export const userGuard: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const { userId } = req.params;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header not found" });
  }

  const user = await prisma.user.findUnique({
    where: { loginToken: authHeader },
    include: {
      photos: true,
    },
  });

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (userId && user.id !== userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.ctx = { user };

  next();
};

