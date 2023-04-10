import express from "express";
import matchingEventRouter from "./matching-event";
import userRouter from "./user";
import { getCosCredential } from "../controller";

const apiRouter = express.Router();

apiRouter.use(userRouter);
apiRouter.use(matchingEventRouter);
apiRouter.get("/cos/sts", getCosCredential);

export default apiRouter;

