"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var matching_event_1 = __importDefault(require("./matching-event"));
var picking_1 = __importDefault(require("./picking"));
var user_1 = __importDefault(require("./user"));
var apiRouter = express_1.default.Router();
apiRouter.use(user_1.default);
apiRouter.use(picking_1.default);
apiRouter.use(matching_event_1.default);
exports.default = apiRouter;
