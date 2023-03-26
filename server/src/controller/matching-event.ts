import { RequestHandler } from "express";
import MatchingEventRepository from "../domain/matching-event/repo";
import UserRepository from "../domain/user/repo";

export const getMatchingEventById: RequestHandler = async (req, res) => {
  const event = await MatchingEventRepository.getMatchingEvent({
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

export const getMatchingEventForUser: RequestHandler = async (req, res) => {
  const { eventId, userId } = req.params;
  const user = await UserRepository.findOneByOrFail({ id: userId });
  const event =
    await MatchingEventRepository.getMatchingEventWithParticipantsByEventId({
      eventId,
    });

  if (event.phase === "choosing") {
    const oppositeGender = user.gender === "male" ? "female" : "male";
    event.participants = event.participants.filter(
      (p) => p.gender === oppositeGender
    );
  }
  res.json(event);
};

