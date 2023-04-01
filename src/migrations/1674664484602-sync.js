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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sync1674664484602 = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
var sync1674664484602 = /** @class */ (function () {
    function sync1674664484602() {
        this.name = "sync1674664484602";
    }
    sync1674664484602.prototype.up = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking\" DROP CONSTRAINT \"FK_09f1090024aaedd83134c7c7dfc\"\n        ")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking\" DROP CONSTRAINT \"FK_63c556218ad624c0413971447d8\"\n        ")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking\" DROP COLUMN \"ownedById\"\n        ")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking\" DROP COLUMN \"pickedId\"\n        ")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking\"\n            ADD \"madeByUserId\" uuid\n        ")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking\"\n            ADD \"pickedUserId\" uuid\n        ")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking\"\n            ADD CONSTRAINT \"FK_941fab583d61f8f58ad038118d9\" FOREIGN KEY (\"madeByUserId\") REFERENCES \"user\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION\n        ")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking\"\n            ADD CONSTRAINT \"FK_0e6c0767733d3dc7d0cd32591bc\" FOREIGN KEY (\"pickedUserId\") REFERENCES \"user\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION\n        ")];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    sync1674664484602.prototype.down = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking\" DROP CONSTRAINT \"FK_0e6c0767733d3dc7d0cd32591bc\"\n        ")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking\" DROP CONSTRAINT \"FK_941fab583d61f8f58ad038118d9\"\n        ")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking\" DROP COLUMN \"pickedUserId\"\n        ")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking\" DROP COLUMN \"madeByUserId\"\n        ")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking\"\n            ADD \"pickedId\" uuid\n        ")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking\"\n            ADD \"ownedById\" uuid\n        ")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking\"\n            ADD CONSTRAINT \"FK_63c556218ad624c0413971447d8\" FOREIGN KEY (\"pickedId\") REFERENCES \"user\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION\n        ")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking\"\n            ADD CONSTRAINT \"FK_09f1090024aaedd83134c7c7dfc\" FOREIGN KEY (\"ownedById\") REFERENCES \"user\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION\n        ")];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return sync1674664484602;
}());
exports.sync1674664484602 = sync1674664484602;
