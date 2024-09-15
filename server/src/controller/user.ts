import { RequestHandler } from "express";
import { User, UserInitParams, UserUpdateParams } from "../domain/user/model";

import PhotoRepository from "../domain/photo/repository";
import { Photo } from "../domain/photo/model";
import UserRepository from "../domain/user/repo";
import MatchingEventRepository from "../domain/matching-event/repo";
import SmsAdapter from "../adapter/sms";
import {
  generateVerificationCode,
  getCodeByPhoneNumber,
  verifyVerificationCode,
} from "../helper/phone-verification-code-cache";
import { wechatAdapter } from "..";
import { prisma } from "../prisma";
import { UserModel } from "../domain/user/model2";

// need better way to do DI
const smsAdapter = new SmsAdapter();

export const loginOrSignupByWechat: RequestHandler = async (req, res) => {
  const { code, eventId } = req.query;
  if (!code) {
    res.status(400).json({ message: "code not found" });
    return;
  }
  const { access_token, openid } = await wechatAdapter.getUserAccessToken(
    code as string
  );

  const userInfo = await wechatAdapter.getUserInfo(access_token, openid);
  console.log("userInfo", userInfo);

  const user =
    (await UserRepository.findOneBy({ wechatOpenId: openid })) ??
    (await UserRepository.save(
      User.init({
        wechatOpenId: openid,
        name: userInfo.nickname,
        gender:
          userInfo.sex === 0
            ? "male"
            : userInfo.sex === 1
            ? "female"
            : undefined,
      })
    ));

  if (!user) {
    res.status(400).json({ message: "user not found" });
    return;
  }

  res.redirect(
    `https://luudii.com/?access_token=${user.loginToken}&event_id=${eventId}`
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
    (await UserRepository.findOneBy({ phoneNumber })) ??
    (await UserRepository.save(
      User.init({
        phoneNumber,
      })
    ));

  (await MatchingEventRepository.findParticipantByEventIdAndUserId({
    eventId,
    userId: user.id,
  })) ??
    (await MatchingEventRepository.createParticipantInMatchingEvent({
      eventId,
      userId: user.id,
    }));

  res.cookie("token", user.loginToken);
  res.header("Access-Control-Allow-Credentials", "true"); // why not useful
  res.status(201).json(user);
};

export const getUserByAccessToken: RequestHandler = async (req, res) => {
  const authHeader = req.headers.authorization;
  const user = await UserModel.findByAccessToken(authHeader);
  if (!user) {
    res.status(404).json({ error: "user not found" });
    return;
  }

  console.log("user", user);

  const events = await prisma.matching_event.findMany({
    where: {
      participant: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  delete user.loginToken;
  res.json({
    ...user.getPrismaUser(),
    hasValidProfile: user.hasValidProfile,
    eventIds: events.map((e) => e.id),
  });
};

export const updateUserProfile: RequestHandler = async (req, res, next) => {
  const user = await UserRepository.findOneByOrFail({ id: req.ctx!.user.id });
  const values = req.body as UserUpdateParams;
  user.update(values);
  await UserRepository.save(user).catch(next);
  res.json(user);
};

export const handlePhotoUploaded: RequestHandler = async (req, res, next) => {
  const { userId } = req.params;
  const { cosLocation } = req.body;

  const user = await UserRepository.findOneByOrFail({ id: userId });
  const newPhoto = Photo.init({ url: cosLocation, user });
  await PhotoRepository.save(newPhoto).catch(next);
  res.sendStatus(200);
};

export const getPhotosByUserId: RequestHandler = async (req, res, next) => {
  const { userId } = req.params;

  const photos = await PhotoRepository.getPhotosByUser(userId).catch(next);
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

export const userGuard: RequestHandler = async (req, res, next) => {
  console.log("user guarded", req.path);
  const authHeader = req.headers.authorization;
  const { userId } = req.params;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header not found" });
  }

  const user = await prisma.user.findUnique({
    where: { loginToken: authHeader },
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

