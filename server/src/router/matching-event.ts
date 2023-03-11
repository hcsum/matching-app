import express from "express";
import { MatchingEventController } from "../controller";

const matchingEventRouter = express.Router();

matchingEventRouter.get(
  "/matching-events/user/:userId",
  MatchingEventController.getMatchingEventsByUserId
);

matchingEventRouter.get(
  "/matching-event/:eventId",
  MatchingEventController.getMatchingEventById
);

matchingEventRouter.get(
  "/matching-event/:eventId/user/:userId",
  MatchingEventController.getMatchingEventForUser
);

export default matchingEventRouter;
