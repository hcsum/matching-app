import express from "express";
import { MatchingEventController, UserController } from "../controller";

const matchingEventRouter = express.Router();

matchingEventRouter.get("/", MatchingEventController.getMatchingEventById);
matchingEventRouter.get("/list", MatchingEventController.getAllMatchingEvents);
matchingEventRouter.get(
  "/:eventId",
  MatchingEventController.getMatchingEventById
);

// --- userGuard ---
matchingEventRouter.use("/:eventId/user/:userId/", UserController.userGuard);

matchingEventRouter.get(
  "/:eventId/user/:userId/participant",
  MatchingEventController.getParticipatedEventByEventIdAndUserId
);
matchingEventRouter.get(
  "/:eventId/user/:userId/participant/check",
  MatchingEventController.checkIsParticipantByUserIdAndEventId
);
matchingEventRouter.post(
  "/:eventId/user/:userId/join",
  MatchingEventController.join
);
matchingEventRouter.post(
  "/:eventId/user/:userId/join-prepaid",
  MatchingEventController.joinPrepaid
);

// --- participantGuard ---
matchingEventRouter.use(
  "/:eventId/user/:userId",
  MatchingEventController.participantGuard
);

matchingEventRouter.get(
  "/:eventId/user/:userId/picking",
  MatchingEventController.getAllPickingsByUser
);
matchingEventRouter.put(
  "/:eventId/user/:userId/picking",
  MatchingEventController.toggleUserPick
);
matchingEventRouter.put(
  "/:eventId/user/:userId/picking/confirm",
  MatchingEventController.confirmPickingsByUser
);
matchingEventRouter.get(
  "/:eventId/user/:userId/matches",
  MatchingEventController.getMatchingResultByEventIdAndUserId
);
matchingEventRouter.get(
  "/:eventId/user/:userId/picked-users",
  MatchingEventController.getPickedUsersByUserIdAndEventId
);
matchingEventRouter.get(
  "/:eventId/user/:userId/users-picked-me",
  MatchingEventController.getPickingUsersByUserIdAndEventId
);
matchingEventRouter.put(
  "/:eventId/user/:userId/post-matching-action",
  MatchingEventController.setParticipantPostMatchAction
);
matchingEventRouter.put(
  "/:eventId/user/:userId/post-matching-action/insist",
  MatchingEventController.insistPickingByUser
);
matchingEventRouter.put(
  "/:eventId/user/:userId/post-matching-action/reverse",
  MatchingEventController.reversePickingByUser
);
matchingEventRouter.put(
  "/:eventId/user/:userId/post-matching-action/response-insist",
  MatchingEventController.responseInsistPickingByUser
);

export default matchingEventRouter;

