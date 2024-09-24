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
  Prisma,
  matching_event,
  participant,
} from "@prisma/client";
import { aliPayAdapter } from "..";

type EventUser = Pick<
  user,
  "id" | "name" | "jobTitle" | "bio" | "graduatedFrom"
> & {
  age: number;
  photos: Pick<photo, "cosLocation" | "id">[];
};

// todo: isReverse can't tell who is the reverse picker, right now both user isReverse: true
type MatchedUser = EventUser &
  Pick<picking, "isInsisted" | "isInsistResponded" | "isReverse">;

export const getMatchingEventById: RequestHandler = async (req, res) => {
  const event = await prisma.matching_event.findUnique({
    where: { id: req.params.eventId },
  });
  res.json(event);
};

export const getLatestMatchingEvent: RequestHandler = async (req, res) => {
  const event = await prisma.matching_event.findFirst({
    orderBy: { choosingStartsAt: "desc" },
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

type GetParticipatedEventByEventIdAndUserIdResponse = {
  participant: Pick<
    participant,
    "hasConfirmedPicking" | "postMatchingAction"
  > & {
    hasPerformedPostMatchingAction: boolean;
    hasValidProfile: boolean;
  };
  event: Pick<
    matching_event,
    "id" | "choosingStartsAt" | "matchingStartsAt" | "phase"
  > & {
    participantsToPick: EventUser[];
  };
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
    event.phase === "CHOOSING" && req.ctx.user.hasValidProfile
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
              select: {
                id: true,
                name: true,
                gender: true,
                age: true,
                monthAndYearOfBirth: true,
                hasValidProfile: true,
                bio: true,
                graduatedFrom: true,
                jobTitle: true,
                photos: {
                  select: {
                    cosLocation: true,
                    id: true,
                  },
                },
              },
            },
          },
        })
      : [];

  const userPhotos = await prisma.photo.findMany({
    where: {
      userId,
    },
  });

  const result: GetParticipatedEventByEventIdAndUserIdResponse = {
    participant: {
      hasValidProfile: req.ctx.user.hasValidProfile && userPhotos.length > 0,
      hasConfirmedPicking: participant.hasConfirmedPicking,
      postMatchingAction: participant.postMatchingAction,
      hasPerformedPostMatchingAction:
        event.phase === "MATCHING" &&
        (await checkHasPerformedPostAction({
          userId,
          matchingEventId: eventId,
        })),
    },
    event: {
      id: event.id,
      phase: event.phase,
      choosingStartsAt: event.choosingStartsAt,
      matchingStartsAt: event.matchingStartsAt,
      participantsToPick: participantsToPick
        .map((p) => ({
          ...p.user,
        }))
        .filter((p) => p.photos.length > 0 && p.hasValidProfile),
    },
  };

  res.json(result);
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
  const waitingForInsistResponse: MatchedUser[] = [];

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
    res.status(403).send("You are not a participant of this event");
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

    // todo: refactor this with prisma extension
    return {
      ...pick(user, [
        "id",
        "name",
        "jobTitle",
        "bio",
        "graduatedFrom",
        "age",
        "photos",
      ]),
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

    return {
      // todo
      ...pick(user, [
        "id",
        "name",
        "jobTitle",
        "bio",
        "graduatedFrom",
        "age",
        "photos",
      ]),
    };
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
    },
  });

  return {
    // todo
    ...pick(user, [
      "id",
      "name",
      "jobTitle",
      "bio",
      "graduatedFrom",
      "age",
      "photos",
    ]),
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

