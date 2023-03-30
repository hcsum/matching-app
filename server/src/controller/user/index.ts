/* eslint-disable consistent-return */
import { RequestHandler } from "express";
import {
  User,
  UserInitParams,
  UserUpdateParams,
} from "../../domain/user/model";

import PhotoRepository from "../../domain/photo/repository";
import { Photo } from "../../domain/photo/model";
import UserRepository from "../../domain/user/repo";
import { getCosCredential } from "./helper";

// login or signup
export const upsertUser: RequestHandler = async (req, res, next) => {
  // todo: user has to participate an event
  const { name, jobTitle, age, phoneNumber, gender } =
    req.body as UserInitParams;

  let user = await UserRepository.findOneBy({ phoneNumber });
  if (user) return res.json(user);

  user = User.init({
    name,
    age,
    gender,
    phoneNumber,
    jobTitle,
  });
  const result = await UserRepository.save(user).catch(next);
  res.status(201).json(result);
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

export const getCosCredentialHandler: RequestHandler = async (req, res, next) =>
  getCosCredential(req, res, next);
