import { RequestHandler } from "express";
import MatchingEventRepository from "../domain/matching-event/repo";

export const getMatchingEvent: RequestHandler = async (req, res) => {
  const event = await MatchingEventRepository.findOneBy({
    id: req.params.userId,
  });
  res.json(event);
};
