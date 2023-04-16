import express from "express";
import { MatchingEventController } from "../controller";

const matchingEventRouter = express.Router();

matchingEventRouter.get(
  "/matching-event",
  MatchingEventController.getLatestMatchingEvent
);
matchingEventRouter.get(
  "/matching-event/:eventId",
  MatchingEventController.getMatchingEventById
);

// guard
matchingEventRouter.use(
  "/matching-event/:eventId/user/:userId",
  MatchingEventController.participantGuard
);

matchingEventRouter.get(
  "/matching-event/:eventId/user/:userId",
  MatchingEventController.getMatchingEventForUser
);
matchingEventRouter.get(
  "/matching-event/:eventId/user/:userId/picking",
  MatchingEventController.getAllPickingsByUser
);
matchingEventRouter.put(
  "/matching-event/:eventId/user/:userId/picking",
  MatchingEventController.toggleUserPick
);
matchingEventRouter.put(
  "/matching-event/:eventId/user/:userId/picking/confirm",
  MatchingEventController.confirmPickingsByUser
);
matchingEventRouter.get(
  "/matching-event/:eventId/user/:userId/matching",
  MatchingEventController.getMatchingResultByEventIdAndUserId
);
matchingEventRouter.get(
  "/matching-event/:eventId/user/:userId/participant",
  MatchingEventController.getParticipantByUserIdAndEventId
);
matchingEventRouter.get(
  "/matching-event/:eventId/user/:userId/picked-users",
  MatchingEventController.getPickedUsersByUserIdAndEventId
);
matchingEventRouter.put(
  "/matching-event/:eventId/user/:userId/post-matching-action",
  MatchingEventController.setParticipantPostMatchAction
);
matchingEventRouter.put(
  "/matching-event/:eventId/user/:userId/post-matching-action/insist",
  MatchingEventController.setParticipantInsistOnPicking
);

export default matchingEventRouter;
