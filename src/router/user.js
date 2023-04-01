"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var controller_1 = require("../controller");
var userRouter = express_1.default.Router();
// todo: move cos sts to another handler and route
userRouter.get("/cos/sts", controller_1.UserController.getCosCredentialHandler);
userRouter.post("/user/upsert", controller_1.UserController.upsertUser);
userRouter.get("/user/:userId", controller_1.UserController.getUser);
userRouter.put("/user/:userId/", controller_1.UserController.updateUser);
userRouter.get("/user/:userId/photos", controller_1.UserController.getPhotosByUserId);
userRouter.post("/user/:userId/photo-uploaded", controller_1.UserController.handlePhotoUploaded);
exports.default = userRouter;
