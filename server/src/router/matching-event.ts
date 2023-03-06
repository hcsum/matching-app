import express from "express";
import { MatchingEventController } from "../controller";

const matchingEventRouter = express.Router();

matchingEventRouter.get(
  "/matching-event/:eventId",
  MatchingEventController.getMatchingEvent
);

export default matchingEventRouter;
