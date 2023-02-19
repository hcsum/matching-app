import { RequestHandler } from "express";
import { User, UserInitParams } from "../domain/user/model";
import UserRepository from "../domain/user/repo";

export const addUser: RequestHandler = async (req, res, next) => {
  const { name, jobTitle, age, phoneNumber, gender } =
    req.body as UserInitParams;
  const newUser = User.init({ name, age, gender, phoneNumber, jobTitle });
  const user = await UserRepository.save(newUser).catch(next);
  res.json(user);
};

export const getUser: RequestHandler = async (req, res, next) => {
  const user = await UserRepository.findOneBy({ id: req.params.userId });
  res.json(user);
};

export const updateUserBio: RequestHandler = async (req, res, next) => {
  const user = await UserRepository.findOneBy({ id: req.params.userId });
  const { bio } = req.body as { bio: Record<string, string> };
  user.updateBio(bio);
  await UserRepository.save(user).catch(next);
  res.json(user);
};
