import { RequestHandler } from "express";
import path from "path";

const STATIC_FILE_PATH = "/app/build";

const fileRouter: RequestHandler = (req, res, next) => {
  console.log("req.url", req.url);
  const filePath = path.join(STATIC_FILE_PATH, req.url);

  console.log("filePath", filePath);
  console.log("ext", path.extname(filePath));

  if (path.extname(filePath) === "") {
    return res.sendFile(path.join(STATIC_FILE_PATH, "/"));
  }

  return res.sendFile(filePath);
};
export default fileRouter;

