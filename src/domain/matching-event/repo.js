"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_source_1 = __importDefault(require("../../data-source"));
var model_1 = require("./model");
var MatchingEventRepository = data_source_1.default.getRepository(model_1.MatchingEvent).extend({
    getMatchingEventsByUserId: function (_a) {
        var userId = _a.userId;
        var query = MatchingEventRepository.createQueryBuilder("matching_event")
            .leftJoin("matching_event.participants", "participants")
            .where("participants.id = :userId", { userId: userId });
        return query.getMany();
    },
    getMatchingEvent: function (_a) {
        var id = _a.id;
        return MatchingEventRepository.findOneBy({ id: id });
    },
    getMatchingEventWithParticipantsByEventId: function (_a) {
        var eventId = _a.eventId, gender = _a.gender;
        var query = MatchingEventRepository.createQueryBuilder("matching_event")
            .leftJoinAndSelect("matching_event.participants", "participant")
            .leftJoinAndSelect("participant.photos", "photo")
            .select([
            "matching_event",
            "participant.name",
            "participant.jobTitle",
            "participant.age",
            "participant.id",
            "participant.bio",
            "photo",
        ])
            .where("matching_event.id = :eventId", { eventId: eventId })
            .andWhere("participant.gender = :gender", { gender: gender });
        return query.getOne();
    },
});
exports.default = MatchingEventRepository;
