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
exports.Picking = void 0;
/* eslint-disable import/no-cycle */
var typeorm_1 = require("typeorm");
var model_1 = require("../user/model");
var model_2 = require("../matching-event/model");
var Picking = /** @class */ (function () {
    function Picking() {
        this.isConfirmed = false;
    }
    Picking_1 = Picking;
    Picking.init = function (_a) {
        var matchingEventId = _a.matchingEventId, madeByUserId = _a.madeByUserId, pickedUserId = _a.pickedUserId;
        var picking = new Picking_1();
        picking.matchingEventId = matchingEventId;
        picking.madeByUserId = madeByUserId;
        picking.pickedUserId = pickedUserId;
        return picking;
    };
    var Picking_1;
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", String)
    ], Picking.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return model_2.MatchingEvent; }, function (matchingEvent) { return matchingEvent.pickings; }),
        (0, typeorm_1.JoinColumn)({ name: "matchingEventId" }),
        __metadata("design:type", model_2.MatchingEvent)
    ], Picking.prototype, "matchingEvent", void 0);
    __decorate([
        (0, typeorm_1.Column)("uuid"),
        __metadata("design:type", String)
    ], Picking.prototype, "matchingEventId", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return model_1.User; }),
        (0, typeorm_1.JoinColumn)({ name: "madeByUserId" }),
        __metadata("design:type", model_1.User)
    ], Picking.prototype, "madeByUser", void 0);
    __decorate([
        (0, typeorm_1.Column)("uuid"),
        __metadata("design:type", String)
    ], Picking.prototype, "madeByUserId", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return model_1.User; }),
        (0, typeorm_1.JoinColumn)({ name: "pickedUserId" }),
        __metadata("design:type", model_1.User)
    ], Picking.prototype, "pickedUser", void 0);
    __decorate([
        (0, typeorm_1.Column)("uuid"),
        __metadata("design:type", String)
    ], Picking.prototype, "pickedUserId", void 0);
    __decorate([
        (0, typeorm_1.Column)("bool", { default: false }),
        __metadata("design:type", Boolean)
    ], Picking.prototype, "isConfirmed", void 0);
    Picking = Picking_1 = __decorate([
        (0, typeorm_1.Entity)()
    ], Picking);
    return Picking;
}());
exports.Picking = Picking;
