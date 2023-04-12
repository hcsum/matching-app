import { RequestHandler } from "express";
import MatchingEventRepository from "../domain/matching-event/repo";
import UserRepository from "../domain/user/repo";
import { omit, pick } from "lodash";
import { MatchingEvent } from "../domain/matching-event/model";
import { User } from "../domain/user/model";
import ParticipantRepository from "../domain/participant/repo";
import PickingRepository from "../domain/picking/repo";
import { Picking } from "../domain/picking/model";
import PhotoRepository from "../domain/photo/repository";

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
  // const participant = await ParticipantRepository.findOneBy({
  //   matchingEventId: event.id,
  //   userId: user.id,
  // });

  const transformedEvent: TransformedEvent = {
    ...omit(event, ["participants"]),
  };

  // if (participant.hasConfirmedPicking) {
  //   transformedEvent.phase = "matching";
  // }

  if (transformedEvent.phase === "choosing") {
    transformedEvent.participants = event.participants.map(
      (participant) => participant.user
    );
  }

  res.json(transformedEvent);
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

type Matching = Pick<User, "id" | "name" | "age" | "jobTitle"> & {
  photoUrl: string;
};

export const getMatchingResultByEventIdAndUserId: RequestHandler = async (
  req,
  res
) => {
  const { eventId, userId } = req.params;

  const event = await MatchingEventRepository.findOneBy({ id: eventId });

  if (event.phase !== "matching") {
    res.status(400).send("Matching is not finished yet");
    return;
  }

  const [userPickings, userBeingPickeds] = await Promise.all([
    PickingRepository.findBy({
      madeByUserId: userId,
      matchingEventId: eventId,
    }),
    PickingRepository.findBy({
      pickedUserId: userId,
      matchingEventId: eventId,
    }),
  ]);

  const result: Matching[] = [];

  for (const beingPicked of userBeingPickeds) {
    if (
      userPickings.some(
        (picking) => picking.pickedUserId === beingPicked.madeByUserId
      )
    ) {
      const user = await UserRepository.findOneBy({
        id: beingPicked.madeByUserId,
      });
      const photos = await PhotoRepository.getPhotosByUser(user.id);

      result.push({
        ...pick(user, ["id", "name", "age", "jobTitle"]),
        photoUrl: photos[0].url,
      });
    }
  }

  res.json(result);
};

export const participantGuard: RequestHandler = async (req, res, next) => {
  const { eventId, userId } = req.params;
  const participant = await ParticipantRepository.findOneBy({
    matchingEventId: eventId,
    userId,
  });

  if (!participant) {
    res.status(403).send("You are not a participant of this event");
    return;
  }

  next();
};

export const getParticipantByUserIdAndEventId: RequestHandler = async (
  req,
  res
) => {
  const { eventId, userId } = req.params;
  const participant = await ParticipantRepository.findOneBy({
    matchingEventId: eventId,
    userId,
  });

  res.json(participant);
};

type TransformedPickedUser = Pick<User, "id" | "name" | "age" | "jobTitle"> & {
  photoUrl: string;
  pickingId: string;
};

export const getPickedUsersByUserIdAndEventId: RequestHandler = async (
  req,
  res
) => {
  const { eventId, userId } = req.params;
  const pickings = await PickingRepository.getPickedUsersByUserIdAndEventId({
    matchingEventId: eventId,
    madeByUserId: userId,
  });

  const result: TransformedPickedUser[] = pickings.map((picking) => {
    const user = picking.pickedUser;
    const photos = user.photos;

    return {
      ...pick(user, ["id", "name", "age", "jobTitle"]),
      photoUrl: photos[0].url,
      pickingId: picking.id,
    };
  });

  res.json(result);
};

