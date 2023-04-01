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
exports.Photo = void 0;
/* eslint-disable import/no-cycle */
var typeorm_1 = require("typeorm");
var model_1 = require("../user/model");
var Photo = /** @class */ (function () {
    function Photo() {
    }
    Photo_1 = Photo;
    Photo.init = function (_a) {
        var url = _a.url, user = _a.user;
        var photo = new Photo_1();
        photo.url = url;
        photo.user = user;
        return photo;
    };
    var Photo_1;
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", Number)
    ], Photo.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)("varchar"),
        __metadata("design:type", String)
    ], Photo.prototype, "url", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return model_1.User; }, function (user) { return user.photos; }),
        __metadata("design:type", model_1.User)
    ], Photo.prototype, "user", void 0);
    Photo = Photo_1 = __decorate([
        (0, typeorm_1.Entity)()
    ], Photo);
    return Photo;
}());
exports.Photo = Photo;
