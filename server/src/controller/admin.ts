import { RequestHandler } from "express";
import { prisma } from "../prisma";
import { matching_event, matching_event_phase, picking } from "@prisma/client";

type resultUser = {
  gender: string;
  name: string;
  id: string;
  isProfileValid?: boolean;
};

export const getAdminMatchingEventById: RequestHandler = async (req, res) => {
  const { eventId } = req.params;
  const event = await prisma.matching_event.findUniqueOrThrow({
    where: {
      id: eventId,
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              gender: true,
            },
          },
        },
      },
    },
  });

  res.json(event);
};

export const getAdminMatchingEventParticipants: RequestHandler = async (
  req,
  res
) => {
  const { eventId } = req.params;
  const participants = await prisma.participant.findMany({
    where: {
      matchingEventId: eventId,
    },
    include: {
      user: {
        include: {
          photos: true,
        },
      },
    },
  });

  const response: resultUser[] = participants.map((p) => ({
    gender: p.user.gender,
    name: p.user.name,
    id: p.user.id,
    eventNumber: p.eventNumber,
    isProfileValid:
      p.user.isBioComplete &&
      p.user.isProfileComplete &&
      p.user.photos.length > 0,
  }));

  res.json(response);
};

type GetAllMatchingResultsByEventIdResponse = {
  matches: resultUser[][];
};

export const getAllMatchingResultsByEventId: RequestHandler = async (
  req,
  res
) => {
  const { eventId } = req.params;
  const results = await prisma.picking.findMany({
    where: {
      matchingEventId: eventId,
      isConfirmed: true,
    },
    include: {
      madeByUser: {
        select: {
          name: true,
          id: true,
          gender: true,
        },
      },
      pickedUser: {
        select: {
          name: true,
          id: true,
          gender: true,
        },
      },
    },
  });

  const matchingPairs = getAllMatchingPairs(results);

  const response: GetAllMatchingResultsByEventIdResponse = {
    matches: matchingPairs,
  };

  res.json(response);
};

function getAllMatchingPairs(
  pickings: (picking & {
    madeByUser: resultUser;
    pickedUser: resultUser;
  })[]
): resultUser[][] {
  const pairMap = new Map<string, picking[]>();
  const userMap = new Map<string, resultUser>();
  const matchSet = new Set<string>();

  // Process all pickings
  for (const pick of pickings) {
    const { madeByUserId, pickedUserId, madeByUser, pickedUser } = pick;

    if (!pairMap.has(madeByUserId)) {
      pairMap.set(madeByUserId, []);
    }
    pairMap.get(madeByUserId)!.push(pick);

    // Store user details
    userMap.set(madeByUserId, madeByUser);
    userMap.set(pickedUserId, pickedUser);
  }

  const matchingPairs: resultUser[][] = [];

  // Find matches
  pairMap.forEach((userPickings, userId) => {
    userPickings.forEach((picking) => {
      const { pickedUserId, isReverse, isInsisted, isInsistResponded } =
        picking;
      const otherUserPickings = pairMap.get(pickedUserId) || [];

      let isMatch = false;

      // Check for mutual pick
      if (otherUserPickings.some((p) => p.pickedUserId === userId)) {
        isMatch = true;
      }
      // Check for reverse pick
      else if (isReverse) {
        isMatch = true;
      }
      // Check for insist and respond
      else if (isInsisted && isInsistResponded) {
        isMatch = true;
      }

      if (isMatch) {
        // Create a unique key for this pair
        const pairKey = [userId, pickedUserId].sort().join("_");

        // Only add if this pair hasn't been added before
        if (!matchSet.has(pairKey)) {
          const user1 = userMap.get(userId)!;
          const user2 = userMap.get(pickedUserId)!;
          matchingPairs.push([user1, user2]);
          matchSet.add(pairKey);
        }
      }
    });
  });

  return matchingPairs;
}

const PhaseOrder = [
  matching_event_phase.INACTIVE,
  matching_event_phase.ENROLLING,
  matching_event_phase.CHOOSING,
  matching_event_phase.MATCHING,
  matching_event_phase.FINISHED,
];

export const updateMatchingEventSettings: RequestHandler = async (req, res) => {
  const { eventId } = req.params;
  const body = req.body;
  const allowedKeys = [
    "title",
    "description",
    "questionnaire",
    "choosingStartsAt",
    "matchingStartsAt",
    "phase",
  ];

  if (Object.keys(body).some((key) => !allowedKeys.includes(key))) {
    return res.status(400).json({ message: "Invalid keys" });
  }

  const event = await prisma.matching_event.findUniqueOrThrow({
    where: {
      id: eventId,
    },
  });

  if (body.phase) {
    const currentPhaseIndex = PhaseOrder.indexOf(event.phase);
    const newPhaseIndex = PhaseOrder.indexOf(body.phase);

    if (newPhaseIndex - currentPhaseIndex !== 1) {
      return res.status(400).json({ message: "Invalid phase transition" });
    }
  }

  if (body.choosingStartsAt && body.matchingStartsAt) {
    if (new Date(body.choosingStartsAt) > new Date(body.matchingStartsAt)) {
      return res.status(400).json({ message: "Invalid time transition" });
    }
  }

  if (body.choosingStartsAt) {
    body.choosingStartsAt = new Date(body.choosingStartsAt);

    if (body.choosingStartsAt < new Date()) {
      return res.status(400).json({ message: "Invalid choosingStartsAt" });
    }
  }

  if (body.matchingStartsAt) {
    body.matchingStartsAt = new Date(body.matchingStartsAt);

    if (
      body.matchingStartsAt < new Date() ||
      new Date(body.matchingStartsAt) <
        new Date(body.choosingStartsAt || event.choosingStartsAt)
    ) {
      return res.status(400).json({ message: "Invalid matchingStartsAt" });
    }
  }

  const updatedEvent = await prisma.matching_event.update({
    where: {
      id: eventId,
    },
    data: {
      ...body,
    },
  });

  res.json(updatedEvent);
};

export const adminGuard: RequestHandler = async (req, res, next) => {
  const { userId, eventId } = req.params as { userId: string; eventId: string };
  console.log(userId, eventId);

  const admin = await prisma.event_admin.findFirst({
    where: {
      userId,
      eventId,
    },
  });

  if (!admin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

