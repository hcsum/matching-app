import { RequestHandler } from "express";
import PickingRepository from "../domain/picking/repo";

export const getAllPickingsByUser: RequestHandler = async (req, res) => {
  const { userId } = req.params;
  const pickings = await PickingRepository.getAllPickingsByUserId(userId);
  res.send(pickings);
};
