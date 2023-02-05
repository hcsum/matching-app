import express from "express";
import { PickingController } from "../controller";

const pickingRouter = express.Router();

pickingRouter.post(`/picking/:userId`, PickingController.addPicking);
pickingRouter.get("/picking/:userId", () => null);

export default pickingRouter;
