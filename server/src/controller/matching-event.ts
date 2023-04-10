import { RequestHandler } from "express";
import MatchingEventRepository from "../domain/matching-event/repo";
import UserRepository from "../domain/user/repo";
import { omit } from "lodash";
import { MatchingEvent } from "../domain/matching-event/model";
import { User } from "../domain/user/model";
import ParticipantRepository from "../domain/participant/repo";
import PickingRepository from "../domain/picking/repo";
import { Picking } from "../domain/picking/model";

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
  const user = await UserRepository.findOneBy({ id: userId });
  const event =
    await MatchingEventRepository.getMatchingEventWithParticipantsByEventId({
      eventId,
      gender: user.gender === "male" ? "female" : "male",
    });
  const participant = await ParticipantRepository.findOneBy({
    matchingEventId: event.id,
    userId: user.id,
  });

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

export const getMatchingResultByEventIdAndUserId: RequestHandler = async (
  req,
  res
) => {
  const { eventId, userId } = req.params;

  const pickings = await PickingRepository.findBy({
    madeByUserId: userId,
    matchingEventId: eventId,
  });
  const pickedBys = await PickingRepository.findBy({
    pickedUserId: userId,
    matchingEventId: eventId,
  });

  console.log(pickings, pickedBys);

  res.json({});
};

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

  const participant = await ParticipantRepository.findOneBy({
    userId,
    matchingEventId: eventId,
  });

  if (participant.hasConfirmedPicking) {
    res.status(400).send("You have already confirmed your pickings");
    return;
  }

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

export const confirmPickingsByUser: RequestHandler = async (req, res) => {
  const { userId, eventId } = req.params;

  const participant = await ParticipantRepository.findOneBy({
    userId,
    matchingEventId: eventId,
  });

  participant.setHasConfirmedPicking(true);

  await ParticipantRepository.save(participant);

  res.send("OK");
};
