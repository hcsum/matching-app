import express from "express";
import { PickingController } from "../controller";

const pickingRouter = express.Router();

pickingRouter.get(
  "/matching-event/:eventId/user/:userId/picking",
  PickingController.getAllPickingsByUser
);
pickingRouter.put(
  "/matching-event/:eventId/user/:userId/picking",
  PickingController.toggleUserPick
);

export default pickingRouter;

