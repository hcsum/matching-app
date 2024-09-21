import express from "express";
import { MatchingEventController, UserController } from "../controller";

const matchingEventRouter = express.Router();

matchingEventRouter.get(
  "/matching-event",
  MatchingEventController.getLatestMatchingEvent
);
matchingEventRouter.get(
  "/matching-event/list",
  MatchingEventController.getAllMatchingEvents
);
matchingEventRouter.get(
  "/matching-event/:eventId",
  MatchingEventController.getMatchingEventById
);

matchingEventRouter.get(
  "/matching-event/:eventId/user/:userId/participant",
  UserController.userGuard,
  MatchingEventController.getParticipantByUserIdAndEventId
);
matchingEventRouter.get(
  "/matching-event/:eventId/user/:userId/participant/check",
  UserController.userGuard,
  MatchingEventController.checkIsParticipantByUserIdAndEventId
);
matchingEventRouter.post(
  "/matching-event/:eventId/user/:userId/join",
  UserController.userGuard,
  MatchingEventController.join
);

// --- participantGuard ---
matchingEventRouter.use(
  "/matching-event/:eventId/user/:userId",
  UserController.userGuard,
  MatchingEventController.participantGuard
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
  "/matching-event/:eventId/user/:userId/picked-users",
  MatchingEventController.getPickedUsersByUserIdAndEventId
);
matchingEventRouter.get(
  "/matching-event/:eventId/user/:userId/users-picked-me",
  MatchingEventController.getPickingUsersByUserIdAndEventId
);
matchingEventRouter.put(
  "/matching-event/:eventId/user/:userId/post-matching-action",
  MatchingEventController.setParticipantPostMatchAction
);
matchingEventRouter.put(
  "/matching-event/:eventId/user/:userId/post-matching-action/insist",
  MatchingEventController.insistPickingByUser
);
matchingEventRouter.put(
  "/matching-event/:eventId/user/:userId/post-matching-action/reverse",
  MatchingEventController.reversePickingByUser
);
matchingEventRouter.put(
  "/matching-event/:eventId/user/:userId/post-matching-action/response-insist",
  MatchingEventController.responseInsistPickingByUser
);

export default matchingEventRouter;

