import { RequestHandler, Request } from "express";
import { pick } from "lodash";
import ParticipantRepository from "../domain/participant/repo";
import PickingRepository from "../domain/picking/repo";
import PhotoRepository from "../domain/photo/repository";
import { PostMatchingAction } from "../domain/participant/model";
import { prisma } from "../prisma";
import { participant, picking, user } from "@prisma/client";
import { aliPayAdapter } from "..";

type UserResponse = Pick<user, "id" | "name" | "jobTitle">;

type MatchedUser = UserResponse &
  Pick<picking, "isInsisted" | "isInsistResponded"> & {
    photoUrl: string;
  };

interface RequestWithParticipant extends Request {
  participant: participant;
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
  const pickings = await PickingRepository.findMany({
    where: {
      madeByUserId: userId,
      matchingEventId: eventId,
    },
  });
  res.send(pickings);
};

export const toggleUserPick: RequestHandler = async (req, res) => {
  const { userId, eventId } = req.params;
  const { pickedUserId } = req.body;

  const participant = await ParticipantRepository.findFirst({
    where: {
      matchingEventId: eventId,
      userId,
    },
  });

  if (participant.hasConfirmedPicking) {
    res.status(400).send("You have already confirmed your pickings");
    return;
  }

  const picking = await PickingRepository.findFirst({
    where: {
      madeByUserId: userId,
      pickedUserId,
      matchingEventId: eventId,
    },
  });

  if (picking) {
    await PickingRepository.delete({
      where: {
        id: picking.id,
      },
    });
  } else {
    await prisma.picking.create({
      data: {
        madeByUserId: userId,
        pickedUserId,
        matchingEventId: eventId,
      },
    });
  }

  res.send("OK");
};

export const confirmPickingsByUser: RequestHandler = async (req, res) => {
  const { userId, eventId } = req.params;

  const participant = await ParticipantRepository.findFirst({
    where: {
      userId,
      matchingEventId: eventId,
    },
  });

  await prisma.participant.update({
    where: {
      id: participant.id,
    },
    data: {
      hasConfirmedPicking: true,
    },
  });

  res.send("OK");
};

export const getMatchingResultByEventIdAndUserId: RequestHandler = async (
  req,
  res
) => {
  const { eventId, userId } = req.params;

  const event = await prisma.matching_event.findUnique({
    where: { id: eventId },
  });

  if (event.phase !== "MATCHING") {
    res.status(400).send("Matching is not finished yet");
    return;
  }

  const matched: MatchedUser[] = [];
  const insisted: MatchedUser[] = [];
  const reverse: MatchedUser[] = [];

  const [userPickings, userBeingPickeds] = await Promise.all([
    PickingRepository.findMany({
      where: {
        madeByUserId: userId,
        matchingEventId: eventId,
      },
    }),
    PickingRepository.findMany({
      where: {
        pickedUserId: userId,
        matchingEventId: eventId,
      },
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
  const participant = await ParticipantRepository.findFirst({
    where: {
      matchingEventId: eventId,
      userId,
    },
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

  const result = pickings.map((picking) => {
    const user = picking.pickedUser;
    const photos = user.photo;

    return {
      ...pick(user, ["id", "name", "jobTitle"]),
      photoUrl: photos[0]?.cosLocation,
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

  const result = pickings.map((picking) => {
    const user = picking.madeByUser;
    const photos = user.photo;

    return {
      ...pick(user, ["id", "name", "jobTitle"]),
      photoUrl: photos[0]?.cosLocation,
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
    const beingPickeds = await PickingRepository.findMany({
      where: { matchingEventId: eventId, pickedUserId: userId },
    });

    if (beingPickeds.length === 0) return res.send("can not chooose reverse");
  }

  await prisma.participant.update({
    where: {
      id: participant.id,
    },
    data: {
      postMatchingAction: action,
    },
  });

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
    await PickingRepository.findFirst({
      where: {
        madeByUserId: userId,
        matchingEventId: eventId,
        isInsisted: true,
      },
    })
  ) {
    return next(new Error("already insist on a user"));
  }

  const picking = await PickingRepository.findFirstOrThrow({
    where: {
      madeByUserId: userId,
      pickedUserId,
      matchingEventId: eventId,
    },
  });

  await PickingRepository.update({
    where: {
      id: picking.id,
    },
    data: {
      isInsisted: true,
    },
  });

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
    await PickingRepository.findFirst({
      where: {
        matchingEventId: eventId,
        isReverse: true,
        pickedUserId: userId,
      },
    })
  ) {
    return next(new Error("already reverse pick a user"));
  }

  const picking = await PickingRepository.findFirstOrThrow({
    where: {
      madeByUserId,
      pickedUserId: userId,
      matchingEventId: eventId,
    },
  });

  await PickingRepository.update({
    where: {
      id: picking.id,
    },
    data: {
      isReverse: true,
    },
  });

  const participant = req.participant;

  // const savedParticipant = await ParticipantRepository.save(participant);

  res.json(participant);
};

export const responseInsistPickingByUser: RequestHandler = async (
  req: RequestWithParticipant,
  res,
  next
) => {
  const { eventId } = req.params;
  const { insistedUserId } = req.body;

  // todo: ..OrFail typeorm method will not fail but return random value if where field is undefinded
  const insistedPicking = await PickingRepository.findFirstOrThrow({
    where: {
      isInsisted: true,
      isInsistResponded: false,
      madeByUserId: insistedUserId,
      pickedUserId: req.participant.userId,
      matchingEventId: eventId,
    },
  });

  await PickingRepository.update({
    where: {
      id: insistedPicking.id,
    },
    data: {
      isInsistResponded: true,
    },
  });

  const insistedUserParticipant = await ParticipantRepository.findFirstOrThrow({
    where: {
      userId: insistedUserId,
      matchingEventId: eventId,
    },
  });

  // await ParticipantRepository.save(insistedUserParticipant);

  res.send("OK");
};

const transformPickingToMatchedUser = async ({
  userId,
  picking,
}: {
  userId: string;
  picking?: picking;
}): Promise<MatchedUser> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  const photos = await PhotoRepository.getPhotosByUser(user.id);

  return {
    ...pick(user, ["id", "name", "jobTitle"]),
    photoUrl: photos[0]?.cosLocation,
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
    PickingRepository.findMany({
      where: {
        madeByUserId: userId,
        matchingEventId: matchingEventId,
      },
    }),
    PickingRepository.findMany({
      where: {
        pickedUserId: userId,
        matchingEventId: matchingEventId,
      },
    }),
  ]);

  if (pickings.some((p) => p.isInsistResponded)) return "done";
  if (pickings.some((p) => p.isInsisted)) return "wait-for-insist-response";
  if (beingPickeds.some((p) => p.isReverse)) return "done";
  return "not-set";
};

export const join: RequestHandler = async (req, res) => {
  const { eventId, userId } = req.params;

  const participant = await ParticipantRepository.findFirst({
    where: {
      matchingEventId: eventId,
      userId,
    },
  });

  if (participant) {
    res.status(400).send("You have already joined this event");
    return;
  }

  const order = await prisma.order.create({
    data: {
      status: "PENDING",
      amount: 0.01,
      eventId,
      userId,
    },
  });

  const form = await aliPayAdapter.createAlipayOrder({
    eventId,
    amount: order.amount.toString(),
    orderId: order.id,
    subject: "测试中",
  });

  res.json({ form });
};

export const checkIsParticipantByUserIdAndEventId: RequestHandler = async (
  req,
  res
) => {
  const { eventId, userId } = req.params;
  const participant = await prisma.participant.findFirst({
    where: {
      userId,
      matchingEventId: eventId,
    },
  });

  res.json({ isParticipant: !!participant });
};

export const getAllMatchingEvents: RequestHandler = async (req, res) => {
  const events = await prisma.matching_event.findMany({
    where: {
      // startChoosingAt: {
      //   lte: new Date(),
      // },
    },
  });

  res.json(events);
};

