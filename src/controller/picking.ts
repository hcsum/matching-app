import { RequestHandler } from "express";
import AppDataSource from "../dataSource";
import { Picking } from "../domain/picking/model";

export const addPicking: RequestHandler = async (req, res, next) => {
  const { userId } = req.params;
  const query = AppDataSource.getRepository(Picking)
    .createQueryBuilder("picking")
    .leftJoinAndSelect("picking.pickedUser", "pickedUser")
    .where("picking.madeByUser = :id", { id: userId });

  console.log("query", query.getQuery());

  const pickings = await query.getMany();

  res.send(pickings);
};
