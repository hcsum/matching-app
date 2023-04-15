import { RequestHandler } from "express";
import path from "path";

const STATIC_FILE_PATH = "/app/build"; // path inside docker container

const fileRouter: RequestHandler = (req, res, next) => {
  const filePath = path.join(STATIC_FILE_PATH, req.url);

  if (path.extname(filePath) === "") {
    return res.sendFile(path.join(STATIC_FILE_PATH, "/"));
  }

  return res.sendFile(filePath);
};
export default fileRouter;

