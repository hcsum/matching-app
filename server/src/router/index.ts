import express from "express";
import matchingEventRouter from "./matching-event";
import pickingRouter from "./picking";
import userRouter from "./user";

const apiRouter = express.Router();

apiRouter.use(userRouter);
apiRouter.use(pickingRouter);
apiRouter.use(matchingEventRouter);

export default apiRouter;

