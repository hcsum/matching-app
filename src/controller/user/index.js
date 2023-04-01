"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCosCredentialHandler = exports.getPhotosByUserId = exports.handlePhotoUploaded = exports.updateUser = exports.getUser = exports.upsertUser = void 0;
var model_1 = require("../../domain/user/model");
var repository_1 = __importDefault(require("../../domain/photo/repository"));
var model_2 = require("../../domain/photo/model");
var repo_1 = __importDefault(require("../../domain/user/repo"));
var helper_1 = require("./helper");
// login or signup
var upsertUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, jobTitle, age, phoneNumber, gender, user, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.body, name = _a.name, jobTitle = _a.jobTitle, age = _a.age, phoneNumber = _a.phoneNumber, gender = _a.gender;
                return [4 /*yield*/, repo_1.default.findOneBy({ phoneNumber: phoneNumber })];
            case 1:
                if (!((_c = (_d.sent())) !== null && _c !== void 0)) return [3 /*break*/, 2];
                _b = _c;
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, repo_1.default.save(model_1.User.init({
                    name: name,
                    age: age,
                    gender: gender,
                    phoneNumber: phoneNumber,
                    jobTitle: jobTitle,
                }))];
            case 3:
                _b = (_d.sent());
                _d.label = 4;
            case 4:
                user = _b;
                res.cookie("token", user.loginToken);
                res.header("Access-Control-Allow-Credentials", "true"); // why not useful
                res.status(201).json(user);
                return [2 /*return*/];
        }
    });
}); };
exports.upsertUser = upsertUser;
var getUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, repo_1.default.findOneBy({ id: req.params.userId })];
            case 1:
                user = _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); };
exports.getUser = getUser;
var updateUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, values;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, repo_1.default.findOneBy({ id: req.params.userId })];
            case 1:
                user = _a.sent();
                values = req.body;
                user.update(values);
                return [4 /*yield*/, repo_1.default.save(user).catch(next)];
            case 2:
                _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
var handlePhotoUploaded = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, cosLocation, user, newPhoto;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.userId;
                cosLocation = req.body.cosLocation;
                return [4 /*yield*/, repo_1.default.findOneByOrFail({ id: userId })];
            case 1:
                user = _a.sent();
                newPhoto = model_2.Photo.init({ url: cosLocation, user: user });
                return [4 /*yield*/, repository_1.default.save(newPhoto).catch(next)];
            case 2:
                _a.sent();
                res.sendStatus(200);
                return [2 /*return*/];
        }
    });
}); };
exports.handlePhotoUploaded = handlePhotoUploaded;
var getPhotosByUserId = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, photos;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.userId;
                return [4 /*yield*/, repository_1.default.getPhotosByUser(userId).catch(next)];
            case 1:
                photos = _a.sent();
                res.json(photos);
                return [2 /*return*/];
        }
    });
}); };
exports.getPhotosByUserId = getPhotosByUserId;
var getCosCredentialHandler = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, (0, helper_1.getCosCredential)(req, res, next)];
}); }); };
exports.getCosCredentialHandler = getCosCredentialHandler;
