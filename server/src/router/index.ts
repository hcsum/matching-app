import express from "express";
import matchingEventRouter from "./matching-event";
import userRouter from "./user";

const apiRouter = express.Router();

apiRouter.use(userRouter);
apiRouter.use(matchingEventRouter);

export default apiRouter;

