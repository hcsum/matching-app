import { RequestHandler } from "express";
import MatchingEventRepository from "../domain/matching-event/repo";
import UserRepository from "../domain/user/repo";
import { omit } from "lodash";
import { MatchingEvent } from "../domain/matching-event/model";
import { User } from "../domain/user/model";
import ParticipantRepository from "../domain/participant/repo";

type TransformedEvent = Omit<MatchingEvent, "participants"> & {
  participants?: User[];
};

export const getMatchingEventById: RequestHandler = async (req, res) => {
  const event = await MatchingEventRepository.getMatchingEventById({
    id: req.params.eventId,
  });
  res.json(event);
};

export const getLatestMatchingEvent: RequestHandler = async (req, res) => {
  const event = await MatchingEventRepository.getLatestMatchingEvent();
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
      gender: user.gender === "male" ? "female" : "male",
    });
  const participant = await ParticipantRepository.findOneBy({
    matchingEventId: event.id,
    userId: user.id,
  });

  console.log("participant", participant);

  const transformedEvent: TransformedEvent = {
    ...omit(event, ["participants"]),
  };

  if (participant.hasConfirmedPicking) {
    transformedEvent.phase = "matching";
  }

  if (transformedEvent.phase === "choosing") {
    transformedEvent.participants = event.participants.map(
      (participant) => participant.user
    );
  }

  res.json(transformedEvent);
};

