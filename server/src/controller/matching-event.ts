import { RequestHandler } from "express";
import MatchingEventRepository from "../domain/matching-event/repo";

export const getMatchingEventById: RequestHandler = async (req, res) => {
  const event = await MatchingEventRepository.findOneBy({
    id: req.params.eventId,
  });
  res.json(event);
};

export const getMatchingEventsByUserId: RequestHandler = async (req, res) => {
  const events = await MatchingEventRepository.getMatchingEventsByUserId({
    userId: req.params.userId,
  });
  res.json(events);
};
