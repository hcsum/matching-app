"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var controller_1 = require("../controller");
var pickingRouter = express_1.default.Router();
pickingRouter.get("/matching-event/:eventId/user/:userId/picking", controller_1.PickingController.getAllPickingsByUser);
pickingRouter.put("/matching-event/:eventId/user/:userId/picking", controller_1.PickingController.toggleUserPick);
exports.default = pickingRouter;
