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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/* eslint-disable import/no-cycle */
var typeorm_1 = require("typeorm");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var model_1 = require("../photo/model");
var model_2 = require("../picking/model");
var User = /** @class */ (function () {
    function User() {
    }
    User_1 = User;
    User.init = function (_a) {
        var name = _a.name, age = _a.age, gender = _a.gender, phoneNumber = _a.phoneNumber, jobTitle = _a.jobTitle;
        var user = new User_1();
        user.name = name;
        user.age = age;
        user.gender = gender;
        user.phoneNumber = phoneNumber;
        user.jobTitle = jobTitle;
        user.initBio();
        user.setLoginToken();
        return user;
    };
    User.prototype.initBio = function () {
        this.bio = {
            关于我: "",
            我的理想型: "",
        };
    };
    User.prototype.setLoginToken = function () {
        this.loginToken = jsonwebtoken_1.default.sign(this.phoneNumber, process.env.USER_TOKEN_SECRET);
    };
    User.prototype.verifyLoginToken = function (token) {
        var payload = jsonwebtoken_1.default.verify(token, process.env.USER_TOKEN_SECRET);
        return payload === this.phoneNumber;
    };
    User.prototype.update = function (_a) {
        var age = _a.age, bio = _a.bio, gender = _a.gender, jobTitle = _a.jobTitle, name = _a.name;
        this.bio = bio || this.bio;
        this.name = name || this.name;
        this.age = age || this.age;
        this.gender = gender || this.gender;
        this.jobTitle = jobTitle || this.jobTitle;
    };
    var User_1;
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", String)
    ], User.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], User.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], User.prototype, "gender", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], User.prototype, "phoneNumber", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "int", nullable: true }),
        __metadata("design:type", Number)
    ], User.prototype, "age", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], User.prototype, "jobTitle", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], User.prototype, "wechatId", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "jsonb", default: "{}" }),
        __metadata("design:type", Object)
    ], User.prototype, "bio", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "varchar",
            nullable: true,
            comment: "will replace with Wechat OAuth token",
        }),
        __metadata("design:type", String)
    ], User.prototype, "loginToken", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return model_1.Photo; }, function (photo) { return photo.user; }),
        __metadata("design:type", Array)
    ], User.prototype, "photos", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return model_2.Picking; }, function (picking) { return picking.madeByUser; }),
        __metadata("design:type", Array)
    ], User.prototype, "pickings", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], User.prototype, "createdAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)(),
        __metadata("design:type", Date)
    ], User.prototype, "updatedAt", void 0);
    User = User_1 = __decorate([
        (0, typeorm_1.Entity)()
    ], User);
    return User;
}());
exports.User = User;
