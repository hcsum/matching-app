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

// need better way to do DI
const smsAdapter = new SmsAdapter();

export const loginOrSignupByWechat: RequestHandler = async (req, res) => {
  const { code } = req.query;
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

  // todo: update user info if nickname or profile pic changed
  if (!user) {
    res.status(400).json({ message: "user not found" });
    return;
  }

  res.redirect(`https://luudii.com/?access_token=${user.loginToken}`);
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
  const user = await UserRepository.findOneBy({ loginToken: authHeader });

  if (!user) {
    res.status(404).json({ error: "user not found" });
  }

  delete user.loginToken;
  res.json({ ...user, hasValidProfile: user.hasValidProfile });
};

export const updateUserProfile: RequestHandler = async (req, res, next) => {
  const user = await UserRepository.findOneByOrFail({ id: req.ctx.user.id });
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
  console.log("guarded", req.path);
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header not found" });
  }

  const user = await UserRepository.findOneOrFail({
    where: { loginToken: authHeader },
  });

  req.ctx = { user };

  next();
};

