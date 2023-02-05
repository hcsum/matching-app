import express from "express";
import pickingRouter from "./picking";
import userRouter from "./user";

const apiRouter = express.Router();

apiRouter.use(userRouter);
apiRouter.use(pickingRouter);

export default apiRouter;
