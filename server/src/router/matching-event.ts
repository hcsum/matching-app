import express from "express";
import { userAuthGuard, MatchingEventController } from "../controller";

const matchingEventRouter = express.Router();

matchingEventRouter.get(
  "/matching-event",
  MatchingEventController.getLatestMatchingEvent
);

matchingEventRouter.get(
  "/matching-event/:eventId",
  MatchingEventController.getMatchingEventById
);

matchingEventRouter.use(userAuthGuard);

matchingEventRouter.get(
  "/matching-events/user/:userId",
  MatchingEventController.getMatchingEventsByUserId
);
matchingEventRouter.get(
  "/matching-event/:eventId/user/:userId",
  MatchingEventController.getMatchingEventForUser
);

export default matchingEventRouter;

