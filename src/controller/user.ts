import { RequestHandler } from "express";
import { User, UserInitParams } from "../domain/user/model";
import UserRepository from "../domain/user/repository";

export const addUser: RequestHandler = async (req, res, next) => {
  const { name, jobTitle, age, phoneNumber, gender } =
    req.body as UserInitParams;
  const user = User.init({ name, age, gender, phoneNumber, jobTitle });
  await UserRepository.save(user).catch(next);
  res.json({ result: "ok" });
};

export const getUser: RequestHandler = async (req, res, next) => {
  const result = await UserRepository.findBy({ id: req.params.userId });
  res.json({ result });
};
