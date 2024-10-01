import { RequestHandler } from "express";
import { pick } from "lodash";
import ParticipantRepository from "../domain/participant/repo";
import PickingRepository from "../domain/picking/repo";
import { prisma } from "../prisma";
import {
  picking,
  user,
  participant_postMatchingAction,
  photo,
  participant,
} from "@prisma/client";
import { aliPayAdapter } from "..";

type EventUser = Omit<
  user,
  "loginToken" | "wechatOpenId" | "phoneNumber" | "updatedAt" | "createdAt"
> & {
  age: number;
  photos: Pick<photo, "cosLocation" | "id">[];
} & Partial<Pick<participant, "eventNumber">>;

// todo: isReverse can't tell who is the reverse picker, right now both user isReverse: true, same as isInsisted
type MatchedUser = EventUser &
  Pick<picking, "isInsisted" | "isInsistResponded" | "isReverse">;

type GetParticipatedEventByEventIdAndUserIdResponse = {
  participant: Pick<
    participant,
    "hasConfirmedPicking" | "postMatchingAction"
  > & {
    hasPerformedPostMatchingAction: boolean;
  };
  participantsToPick: EventUser[];
};

export const getMatchingEventById: RequestHandler = async (req, res) => {
  const { eventId } = req.params;
  const event = eventId
    ? await prisma.matching_event.findUnique({
        where: { id: req.params.eventId },
      })
    : await prisma.matching_event.findFirst({
        orderBy: { choosingStartsAt: "desc" },
      });
  res.json(event);
};

export const getParticipatedEventByEventIdAndUserId: RequestHandler = async (
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

  const event = await prisma.matching_event.findUnique({
    where: { id: eventId },
  });

  const participantsToPick =
    event.phase === "CHOOSING" &&
    req.ctx.user.isBioComplete &&
    req.ctx.user.isProfileComplete
      ? await prisma.participant.findMany({
          where: {
            matchingEventId: eventId,
            user: {
              gender: {
                not: req.ctx.user.gender,
              },
            },
          },
          include: {
            user: {
              include: {
                photos: true,
              },
            },
          },
        })
      : [];

  const result: GetParticipatedEventByEventIdAndUserIdResponse = {
    participant: {
      hasConfirmedPicking: participant.hasConfirmedPicking,
      postMatchingAction: participant.postMatchingAction,
      hasPerformedPostMatchingAction:
        event.phase === "MATCHING" &&
        (await checkHasPerformedPostAction({
          userId,
          matchingEventId: eventId,
        })),
    },
    participantsToPick: participantsToPick
      .map((p) => ({
        ...p.user,
        eventNumber: p.eventNumber,
      }))
      .filter(
        // (u) => u.photos.length > 0 && u.isBioComplete && u.isProfileComplete // 放松点要求，以免出现用户进去后一个候选都看不到的尴尬
        (u) => u.photos.length > 0
      ),
  };

  res.json(result);
};

export const getMatchingEventsByUserId: RequestHandler = async (req, res) => {
  const events = await prisma.matching_event.findMany({
    where: {
      participants: {
        some: {
          userId: req.ctx.user!.id,
        },
      },
    },
  });

  res.json(events);
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

  const participant = req.ctx.participant;

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
  const participant = req.ctx.participant;

  const pickings = await prisma.picking.findMany({
    where: {
      madeByUserId: participant.userId,
      matchingEventId: participant.matchingEventId,
    },
  });

  if (pickings.length === 0) {
    res.status(400).send("You have not picked anyone");
    return;
  }

  if (pickings.length > 3) {
    res.status(400).send("picked more than 3 users");
    return;
  }

  await prisma.picking.updateMany({
    where: {
      madeByUserId: participant.userId,
      matchingEventId: participant.matchingEventId,
    },
    data: {
      isConfirmed: true,
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
  const waitingForInsistResponse: MatchedUser[] = [];

  const [userPickings, userBeingPickeds] = await Promise.all([
    PickingRepository.findMany({
      where: {
        madeByUserId: userId,
        matchingEventId: eventId,
        isConfirmed: true,
      },
    }),
    PickingRepository.findMany({
      where: {
        pickedUserId: userId,
        matchingEventId: eventId,
        isConfirmed: true,
      },
    }),
  ]);

  for (const beingPicked of userBeingPickeds) {
    // 互选获得的配对
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
    } else if (beingPicked.isInsisted) {
      const user = await transformPickingToMatchedUser({
        userId: beingPicked.madeByUserId,
        picking: beingPicked,
      });
      // 回应坚持选择后获得的配对
      if (beingPicked.isInsistResponded) {
        matched.push(user);
      } else {
        // 待回应的坚持选择
        insisted.push(user);
      }
    }

    // 由于你反选获得的配对
    else if (beingPicked.isReverse) {
      const user = await transformPickingToMatchedUser({
        userId: beingPicked.madeByUserId,
        picking: beingPicked,
      });

      matched.push(user);
    }
  }

  for (const userPicking of userPickings) {
    const user = await transformPickingToMatchedUser({
      userId: userPicking.pickedUserId,
      picking: userPicking,
    });

    // 由于对方回应了你的坚持选择而获得的配对
    if (userPicking.isInsistResponded) {
      matched.push(user);
    } else if (userPicking.isInsisted && !userPicking.isInsistResponded) {
      // 待对方回应的坚持选择
      waitingForInsistResponse.push(user);
    } else if (userPicking.isReverse) {
      // 由于对方反选而获得的配对
      matched.push(user);
    }
  }

  res.json({ matched, insisted, waitingForInsistResponse });
};

export const participantGuard: RequestHandler = async (req, res, next) => {
  const { eventId, userId } = req.params;
  const participant = await ParticipantRepository.findFirst({
    where: {
      matchingEventId: eventId,
      userId,
    },
  });

  if (!participant) {
    res.status(403).json({ error: "you are not a participant of this event" });
    return;
  }

  req.ctx.participant = participant;

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
    return user;
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
    return user;
  });

  res.json(result);
};

export const setParticipantPostMatchAction: RequestHandler = async (
  req,
  res,
  next
) => {
  const { userId, eventId } = req.params;
  const { action } = req.body as { action: participant_postMatchingAction };

  const participant = req.ctx.participant;

  if (participant.postMatchingAction)
    return next(
      new Error("this participant has already set post match action")
    );

  if (action === "REVERSE") {
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

export const insistPickingByUser: RequestHandler = async (req, res, next) => {
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

  res.status(200).send();
};

export const reversePickingByUser: RequestHandler = async (req, res, next) => {
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

  res.status(200).send();
};

export const responseInsistPickingByUser: RequestHandler = async (
  req,
  res,
  next
) => {
  const { eventId } = req.params;
  const { insistedUserId } = req.body;

  const insistedPicking = await PickingRepository.findFirstOrThrow({
    where: {
      isInsisted: true,
      isInsistResponded: false,
      madeByUserId: insistedUserId,
      pickedUserId: req.ctx.participant.userId,
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
    include: {
      photos: true,
    },
    omit: {
      loginToken: true,
      phoneNumber: true,
      wechatOpenId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    ...user,
    isInsisted: picking?.isInsisted,
    isInsistResponded: picking?.isInsistResponded,
    isReverse: picking?.isReverse,
  };
};

const checkHasPerformedPostAction = async ({
  userId,
  matchingEventId,
}: {
  userId: string;
  matchingEventId: string;
}): Promise<boolean> => {
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

  if (pickings.some((p) => p.isInsisted)) return true;
  if (beingPickeds.some((p) => p.isReverse)) return true;
  return false;
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

  await prisma.matching_event.findUniqueOrThrow({
    where: {
      id: eventId,
    },
  });

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
      // choosingStartsAt: {
      //   lte: new Date(),
      // },
    },
  });

  res.json(events);
};

export const joinPrepaid: RequestHandler = async (req, res) => {
  const { eventId, userId } = req.params;

  const event = await prisma.matching_event.findUniqueOrThrow({
    where: { id: eventId },
  });

  if (!event.isPrepaid) {
    res.status(400).send("This event is not prepaid");
    return;
  }

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

  await prisma.participant.create({
    data: {
      matchingEventId: eventId,
      userId,
    },
  });

  res.send("OK");
};

