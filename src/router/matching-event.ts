import express from "express";
import { authorize, MatchingEventController } from "../controller";

const matchingEventRouter = express.Router();

matchingEventRouter.use(authorize);

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

