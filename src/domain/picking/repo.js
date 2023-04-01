"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_source_1 = __importDefault(require("../../data-source"));
var model_1 = require("./model");
var PickingRepository = data_source_1.default.getRepository(model_1.Picking).extend({
    getAllPickingsByUserIdAndEventId: function (userId, eventId) {
        var query = PickingRepository.createQueryBuilder("picking")
            .leftJoinAndSelect("picking.pickedUser", "pickedUser")
            .where("picking.madeByUserId = :userId", { userId: userId })
            .andWhere("picking.matchingEventId = :eventId", { eventId: eventId });
        return query.getMany();
    },
});
exports.default = PickingRepository;
