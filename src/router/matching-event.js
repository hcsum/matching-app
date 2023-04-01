"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var controller_1 = require("../controller");
var matchingEventRouter = express_1.default.Router();
matchingEventRouter.use(controller_1.authorize);
matchingEventRouter.get("/matching-events/user/:userId", controller_1.MatchingEventController.getMatchingEventsByUserId);
matchingEventRouter.get("/matching-event/:eventId", controller_1.MatchingEventController.getMatchingEventById);
matchingEventRouter.get("/matching-event/:eventId/user/:userId", controller_1.MatchingEventController.getMatchingEventForUser);
exports.default = matchingEventRouter;
