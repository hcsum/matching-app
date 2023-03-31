import { RequestHandler } from "express";
import UserRepository from "../domain/user/repo";

export const authorize: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header not found" });
  }

  await UserRepository.findOneOrFail({
    where: { loginToken: authHeader },
  }).catch(next);

  next();
};

