"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingEvent = void 0;
/* eslint-disable import/no-cycle */
var typeorm_1 = require("typeorm");
var model_1 = require("../picking/model");
var model_2 = require("../user/model");
var MatchingEvent = /** @class */ (function () {
    function MatchingEvent() {
        this.phase = "registration";
    }
    MatchingEvent_1 = MatchingEvent;
    MatchingEvent.init = function (_a) {
        var title = _a.title;
        var matchingEvent = new MatchingEvent_1();
        matchingEvent.title = title;
        return matchingEvent;
    };
    MatchingEvent.prototype.setPhase = function (phase) {
        this.phase = phase;
    };
    var MatchingEvent_1;
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", String)
    ], MatchingEvent.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "registration" }),
        __metadata("design:type", String)
    ], MatchingEvent.prototype, "phase", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar" }),
        __metadata("design:type", String)
    ], MatchingEvent.prototype, "title", void 0);
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return model_2.User; }),
        (0, typeorm_1.JoinTable)(),
        __metadata("design:type", Array)
    ], MatchingEvent.prototype, "participants", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return model_1.Picking; }, function (picking) { return picking.matchingEvent; }),
        __metadata("design:type", Array)
    ], MatchingEvent.prototype, "pickings", void 0);
    MatchingEvent = MatchingEvent_1 = __decorate([
        (0, typeorm_1.Entity)()
    ], MatchingEvent);
    return MatchingEvent;
}());
exports.MatchingEvent = MatchingEvent;
