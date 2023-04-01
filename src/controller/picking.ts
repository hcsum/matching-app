import { RequestHandler } from "express";
import { Picking } from "../domain/picking/model";
import PickingRepository from "../domain/picking/repo";

export const getAllPickingsByUser: RequestHandler = async (req, res) => {
  const { eventId, userId } = req.params;
  const pickings = await PickingRepository.findBy({
    madeByUserId: userId,
    matchingEventId: eventId,
  });
  res.send(pickings);
};

export const toggleUserPick: RequestHandler = async (req, res) => {
  const { userId, eventId } = req.params;
  const { pickedUserId } = req.body;

  const picking = await PickingRepository.findOneBy({
    madeByUserId: userId,
    pickedUserId,
    matchingEventId: eventId,
  });

  if (picking) {
    await PickingRepository.remove(picking);
  } else {
    const newPicking = Picking.init({
      madeByUserId: userId,
      pickedUserId,
      matchingEventId: eventId,
    });

    await PickingRepository.save(newPicking);
  }

  res.send("OK");
};

