import express from "express";
import { PickingController } from "../controller";

const pickingRouter = express.Router();

pickingRouter.get(`/picking/:userId`, PickingController.getAllPickingsByUser);

export default pickingRouter;
