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

const smsAdapter = new SmsAdapter();

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

  await MatchingEventRepository.createParticipantInMatchingEvent({
    eventId,
    userId: user.id,
  });

  res.cookie("token", user.loginToken);
  res.header("Access-Control-Allow-Credentials", "true"); // why not useful
  res.status(201).json(user);
};

export const getUser: RequestHandler = async (req, res) => {
  const user = await UserRepository.findOneBy({ id: req.params.userId });
  res.json(user);
};

export const updateUser: RequestHandler = async (req, res, next) => {
  const user = await UserRepository.findOneBy({ id: req.params.userId });
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
    return res.status(401).json({ error: "code not expire yet" });

  await smsAdapter
    .sendLoginVerificationCode({
      phone: phoneNumber,
      code: generateVerificationCode(phoneNumber),
    })
    .catch(next);

  res.json("ok");
};

export const userGuard: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header not found" });
  }

  const user = await UserRepository.findOne({
    where: { loginToken: authHeader },
  }).catch(next);

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  next();
};

