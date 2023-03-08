import express from "express";
import { MatchingEventController } from "../controller";

const matchingEventRouter = express.Router();

matchingEventRouter.get(
  "/matching-event/user/:userId",
  MatchingEventController.getMatchingEventsByUserId
);

matchingEventRouter.get(
  "/matching-event/:eventId",
  MatchingEventController.getMatchingEventById
);

export default matchingEventRouter;
