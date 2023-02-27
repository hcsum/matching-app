import { RequestHandler } from "express";
import { User, UserInitParams, UserUpdateParams } from "../domain/user/model";
import UserRepository from "../domain/user/repo";

// login or signup
export const upsertUser: RequestHandler = async (req, res, next) => {
  const { name, jobTitle, age, phoneNumber, gender } =
    req.body as UserInitParams;

  let user = await UserRepository.findOneBy({ phoneNumber });
  if (user) return res.json(user);

  user = User.init({ name, age, gender, phoneNumber, jobTitle });
  const result = await UserRepository.save(user).catch(next);
  res.status(201).json(result);
};

export const getUser: RequestHandler = async (req, res, next) => {
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
