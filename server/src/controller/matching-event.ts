import { RequestHandler, Request } from "express";
import MatchingEventRepository from "../domain/matching-event/repo";
import UserRepository from "../domain/user/repo";
import { omit, partition, pick } from "lodash";
import { User } from "../domain/user/model";
import ParticipantRepository from "../domain/participant/repo";
import PickingRepository from "../domain/picking/repo";
import { Picking } from "../domain/picking/model";
import PhotoRepository from "../domain/photo/repository";
import { Participant, PostMatchingAction } from "../domain/participant/model";
import { prisma } from "../prisma";

type UserResponse = Pick<User, "id" | "name" | "age" | "jobTitle"> & {
  photoUrl: string;
};

type MatchedUser = UserResponse &
  Pick<Picking, "isInsisted" | "isInsistResponded">;

interface RequestWithParticipant extends Request {
  participant: Participant;
}

export const getMatchingEventById: RequestHandler = async (req, res) => {
  const event = await prisma.matching_event.findUnique({
    where: { id: req.params.eventId },
  });
  res.json(event);
};

export const getLatestMatchingEvent: RequestHandler = async (req, res) => {
  const event = await prisma.matching_event.findFirst({
    orderBy: { startChoosingAt: "desc" },
  });
  res.json(event);
};

export const getUserParticipatedMatchingEvents: RequestHandler = async (
  req,
  res
) => {
  const events = await prisma.matching_event.findMany({
    where: {
      participant: {
        some: {
          userId: req.ctx.user!.id,
        },
      },
    },
  });

  res.json(events);
};

export const getParticipantByUserIdAndEventId: RequestHandler = async (
  req,
  res
) => {
  const { eventId, userId } = req.params;
  const participant = await prisma.participant.findFirst({
    where: {
      matchingEventId: eventId,
      userId,
    },
  });

  if (!participant) {
    res.json({ participant: null });
  }

  const postMatchingStatus = await getPostMatchingStatus({
    userId,
    matchingEventId: eventId,
  });

  const event = await prisma.matching_event.findUnique({
    where: { id: eventId },
  });

  const participants = await prisma.participant.findMany({
    where: {
      matchingEventId: eventId,
    },
    include: {
      user: {
        include: {
          photo: true,
        },
      },
    },
  });

  res.json({
    participant: { ...participant, postMatchingStatus },
    event: {
      ...event,
      participants: participants
        .map((p) => p.user)
        .filter((p) => p.gender !== req.ctx.user.gender),
    },
  });
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

  const matched: MatchedUser[] = [];
  const insisted: MatchedUser[] = [];
  const reverse: MatchedUser[] = [];

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

  for (const beingPicked of userBeingPickeds) {
    // 获得互选结果
    if (
      userPickings.some(
        (picking) => picking.pickedUserId === beingPicked.madeByUserId
      )
    ) {
      const user = await transformPickingToMatchedUser({
        userId: beingPicked.madeByUserId,
        picking: beingPicked,
      });

      matched.push(user);
    }

    // 获得被坚持选择结果
    else if (beingPicked.isInsisted) {
      const user = await transformPickingToMatchedUser({
        userId: beingPicked.madeByUserId,
        picking: beingPicked,
      });

      insisted.push(user);
    }

    // 获得被反选结果
    else if (beingPicked.isReverse) {
      const user = await transformPickingToMatchedUser({
        userId: beingPicked.madeByUserId,
        picking: beingPicked,
      });

      reverse.push(user);
    }
  }

  for (const userPicking of userPickings) {
    if (userPicking.isInsistResponded) {
      const user = await transformPickingToMatchedUser({
        userId: userPicking.pickedUserId,
      });

      matched.push(user);
    }
  }

  res.json({ matched, insisted, reverse });
};

export const participantGuard: RequestHandler = async (
  req: RequestWithParticipant,
  res,
  next
) => {
  const { eventId, userId } = req.params;
  const participant = await ParticipantRepository.findOneBy({
    matchingEventId: eventId,
    userId,
  });

  if (!participant) {
    res.status(403).send("You are not a participant of this event");
    return;
  }

  req.participant = participant;

  next();
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

  const result: UserResponse[] = pickings.map((picking) => {
    const user = picking.pickedUser;
    const photos = user.photos;

    return {
      ...pick(user, ["id", "name", "age", "jobTitle"]),
      photoUrl: photos[0]?.url,
    };
  });

  res.json(result);
};

export const getPickingUsersByUserIdAndEventId: RequestHandler = async (
  req,
  res
) => {
  const { eventId, userId } = req.params;
  const pickings = await PickingRepository.getPickingUsersByUserIdAndEventId({
    matchingEventId: eventId,
    pickedUserId: userId,
  });

  const result: UserResponse[] = pickings.map((picking) => {
    const user = picking.madeByUser;
    const photos = user.photos;

    return {
      ...pick(user, ["id", "name", "age", "jobTitle"]),
      photoUrl: photos[0]?.url,
    };
  });

  res.json(result);
};

export const setParticipantPostMatchAction: RequestHandler = async (
  req: RequestWithParticipant,
  res,
  next
) => {
  const { userId, eventId } = req.params;
  const { action } = req.body as { action: PostMatchingAction };

  const participant = req.participant;

  if (participant.postMatchingAction)
    return next(
      new Error("this participant has already set post match action")
    );

  if (action === "reverse") {
    const [, beingPickedsCount] = await PickingRepository.findAndCount({
      where: { matchingEventId: eventId, pickedUserId: userId },
    });

    if (beingPickedsCount === 0) return res.send("can not chooose reverse");
  }

  participant.setPostMatchAction(action);

  await ParticipantRepository.save(participant);

  res.send("ok");
};

export const insistPickingByUser: RequestHandler = async (
  req: RequestWithParticipant,
  res,
  next
) => {
  const { eventId, userId } = req.params;
  const { pickedUserId } = req.body;

  if (
    await PickingRepository.findOneBy({
      madeByUserId: userId,
      matchingEventId: eventId,
      isInsisted: true,
    })
  ) {
    return next(new Error("already insist on a user"));
  }

  const picking = await PickingRepository.findOneByOrFail({
    matchingEventId: eventId,
    madeByUserId: userId,
    pickedUserId,
  });

  picking.setIsInsisted();

  await PickingRepository.save(picking);

  const postMatchingStatus = await getPostMatchingStatus({
    userId,
    matchingEventId: eventId,
  });

  // todo: why need to return this?
  // why implementation is different from reversePickingByUser
  res.json({ postMatchingStatus });
};

export const reversePickingByUser: RequestHandler = async (
  req: RequestWithParticipant,
  res,
  next
) => {
  const { eventId, userId } = req.params;
  const { madeByUserId } = req.body;

  if (
    await PickingRepository.findOneBy({
      pickedUserId: userId,
      matchingEventId: eventId,
      isReverse: true,
    })
  ) {
    return next(new Error("already reverse pick a user"));
  }

  const picking = await PickingRepository.findOneByOrFail({
    matchingEventId: eventId,
    madeByUserId,
    pickedUserId: userId,
  });

  picking.setIsReverse();

  await PickingRepository.save(picking);

  const participant = req.participant;

  const savedParticipant = await ParticipantRepository.save(participant);

  res.json(savedParticipant);
};

export const responseInsistPickingByUser: RequestHandler = async (
  req: RequestWithParticipant,
  res,
  next
) => {
  const { eventId } = req.params;
  const { insistedUserId } = req.body;

  // todo: ..OrFail typeorm method will not fail but return random value if where field is undefinded
  const insistedPicking = await PickingRepository.findOneByOrFail({
    isInsisted: true,
    isInsistResponded: false,
    madeByUserId: insistedUserId,
    pickedUserId: req.participant.userId,
    matchingEventId: eventId,
  });

  insistedPicking.setInsistResponded();

  await PickingRepository.save(insistedPicking);

  const insistedUserParticipant = await ParticipantRepository.findOneByOrFail({
    userId: insistedUserId,
    matchingEventId: eventId,
  });

  await ParticipantRepository.save(insistedUserParticipant);

  res.send("OK");
};

const transformPickingToMatchedUser = async ({
  userId,
  picking,
}: {
  userId: string;
  picking?: Picking;
}): Promise<MatchedUser> => {
  const user = await UserRepository.findOneBy({
    id: userId,
  });
  const photos = await PhotoRepository.getPhotosByUser(user.id);

  return {
    ...pick(user, ["id", "name", "age", "jobTitle"]),
    photoUrl: photos[0]?.url,
    isInsisted: picking?.isInsisted,
    isInsistResponded: picking?.isInsistResponded,
  };
};

export type PostMatchingStatus =
  | "wait-for-insist-response"
  | "done"
  | "not-set"; // participant has not perform insist/reverse on any picking yet

const getPostMatchingStatus = async ({
  userId,
  matchingEventId,
}: {
  userId: string;
  matchingEventId: string;
}): Promise<PostMatchingStatus> => {
  const [pickings, beingPickeds] = await Promise.all([
    PickingRepository.findBy({
      madeByUserId: userId,
      matchingEventId: matchingEventId,
    }),
    PickingRepository.findBy({
      pickedUserId: userId,
      matchingEventId: matchingEventId,
    }),
  ]);

  if (pickings.some((p) => p.isInsistResponded)) return "done";
  if (pickings.some((p) => p.isInsisted)) return "wait-for-insist-response";
  if (beingPickeds.some((p) => p.isReverse)) return "done";
  return "not-set";
};

