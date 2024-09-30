import express from "express";
import { AdminController } from "../controller";

const adminRouter = express.Router();

adminRouter.use("/:userId/matching-event/:eventId", AdminController.adminGuard);

adminRouter.get(
  "/:userId/matching-event/:eventId",
  AdminController.getAdminMatchingEventById
);
adminRouter.get(
  "/:userId/matching-event/:eventId/participants",
  AdminController.getAdminMatchingEventParticipants
);
adminRouter.get(
  "/:userId/matching-event/:eventId/matching-results",
  AdminController.getAllMatchingResultsByEventId
);
adminRouter.put(
  "/:userId/matching-event/:eventId/settings",
  AdminController.updateMatchingEventSettings
);

export default adminRouter;

