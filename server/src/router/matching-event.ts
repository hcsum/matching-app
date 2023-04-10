import express from "express";
import { MatchingEventController, UserController } from "../controller";

const matchingEventRouter = express.Router();

matchingEventRouter.get(
  "/matching-event",
  MatchingEventController.getLatestMatchingEvent
);

matchingEventRouter.get(
  "/matching-event/:eventId",
  MatchingEventController.getMatchingEventById
);

matchingEventRouter.use(UserController.userAuthGuard);

matchingEventRouter.get(
  "/matching-events/user/:userId",
  MatchingEventController.getMatchingEventsByUserId
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
matchingEventRouter.post(
  "/matching-event/:eventId/user/:userId/participant/confirm-picking",
  MatchingEventController.confirmPickingsByUser
);

export default matchingEventRouter;

