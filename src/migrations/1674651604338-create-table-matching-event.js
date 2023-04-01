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
exports.createTableMatchingEvent1674651604338 = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
var createTableMatchingEvent1674651604338 = /** @class */ (function () {
    function createTableMatchingEvent1674651604338() {
        this.name = "createTableMatchingEvent1674651604338";
    }
    createTableMatchingEvent1674651604338.prototype.up = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query("\n            CREATE TABLE \"user\" (\n                \"id\" uuid NOT NULL DEFAULT uuid_generate_v4(),\n                \"name\" character varying NOT NULL,\n                \"gender\" character varying,\n                \"phoneNumber\" character varying,\n                \"age\" integer,\n                \"wechatId\" character varying,\n                \"createdAt\" TIMESTAMP NOT NULL DEFAULT now(),\n                \"updatedAt\" TIMESTAMP NOT NULL DEFAULT now(),\n                CONSTRAINT \"PK_cace4a159ff9f2512dd42373760\" PRIMARY KEY (\"id\")\n            )\n        ")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            CREATE TABLE \"photo\" (\n                \"id\" uuid NOT NULL DEFAULT uuid_generate_v4(),\n                \"url\" character varying NOT NULL,\n                \"userId\" uuid,\n                CONSTRAINT \"PK_723fa50bf70dcfd06fb5a44d4ff\" PRIMARY KEY (\"id\")\n            )\n        ")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            CREATE TABLE \"matching_event\" (\n                \"id\" uuid NOT NULL DEFAULT uuid_generate_v4(),\n                \"startedAt\" date NOT NULL,\n                \"title\" character varying,\n                CONSTRAINT \"PK_65624d28d02d4d1e9d01e227776\" PRIMARY KEY (\"id\")\n            )\n        ")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            CREATE TABLE \"picking\" (\n                \"id\" uuid NOT NULL DEFAULT uuid_generate_v4(),\n                \"matchingEventId\" uuid,\n                CONSTRAINT \"PK_ca69806eaffe87469fec16ad0b1\" PRIMARY KEY (\"id\")\n            )\n        ")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            CREATE TABLE \"matching_event_participants_user\" (\n                \"matchingEventId\" uuid NOT NULL,\n                \"userId\" uuid NOT NULL,\n                CONSTRAINT \"PK_b7eb2d9c3e3e8d9a72ea68d5f40\" PRIMARY KEY (\"matchingEventId\", \"userId\")\n            )\n        ")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            CREATE INDEX \"IDX_8ec823fe2047e24fa3e85390b9\" ON \"matching_event_participants_user\" (\"matchingEventId\")\n        ")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            CREATE INDEX \"IDX_ac6266dd42ee1c753781bde983\" ON \"matching_event_participants_user\" (\"userId\")\n        ")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            CREATE TABLE \"picking_owned_by_user\" (\n                \"pickingId\" uuid NOT NULL,\n                \"userId\" uuid NOT NULL,\n                CONSTRAINT \"PK_1c492bdce1e6d6aed5f201054b7\" PRIMARY KEY (\"pickingId\", \"userId\")\n            )\n        ")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            CREATE INDEX \"IDX_8eb1a96748ecff50d85228d0f5\" ON \"picking_owned_by_user\" (\"pickingId\")\n        ")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            CREATE INDEX \"IDX_6f4ba243ddc99877b5dcf08443\" ON \"picking_owned_by_user\" (\"userId\")\n        ")];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            CREATE TABLE \"picking_picked_user\" (\n                \"pickingId\" uuid NOT NULL,\n                \"userId\" uuid NOT NULL,\n                CONSTRAINT \"PK_52cb88a93efe93ecd0097e2f921\" PRIMARY KEY (\"pickingId\", \"userId\")\n            )\n        ")];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            CREATE INDEX \"IDX_e15779c72233ac86e00141c6dc\" ON \"picking_picked_user\" (\"pickingId\")\n        ")];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            CREATE INDEX \"IDX_811bcdf2fdbd98b6c4747ffd1d\" ON \"picking_picked_user\" (\"userId\")\n        ")];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"photo\"\n            ADD CONSTRAINT \"FK_4494006ff358f754d07df5ccc87\" FOREIGN KEY (\"userId\") REFERENCES \"user\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION\n        ")];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking\"\n            ADD CONSTRAINT \"FK_c810aa9c2884f17395d27ea6f82\" FOREIGN KEY (\"matchingEventId\") REFERENCES \"matching_event\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION\n        ")];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"matching_event_participants_user\"\n            ADD CONSTRAINT \"FK_8ec823fe2047e24fa3e85390b93\" FOREIGN KEY (\"matchingEventId\") REFERENCES \"matching_event\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n        ")];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"matching_event_participants_user\"\n            ADD CONSTRAINT \"FK_ac6266dd42ee1c753781bde9836\" FOREIGN KEY (\"userId\") REFERENCES \"user\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n        ")];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking_owned_by_user\"\n            ADD CONSTRAINT \"FK_8eb1a96748ecff50d85228d0f5d\" FOREIGN KEY (\"pickingId\") REFERENCES \"picking\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n        ")];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking_owned_by_user\"\n            ADD CONSTRAINT \"FK_6f4ba243ddc99877b5dcf084430\" FOREIGN KEY (\"userId\") REFERENCES \"user\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n        ")];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking_picked_user\"\n            ADD CONSTRAINT \"FK_e15779c72233ac86e00141c6dc7\" FOREIGN KEY (\"pickingId\") REFERENCES \"picking\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n        ")];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking_picked_user\"\n            ADD CONSTRAINT \"FK_811bcdf2fdbd98b6c4747ffd1d9\" FOREIGN KEY (\"userId\") REFERENCES \"user\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n        ")];
                    case 21:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    createTableMatchingEvent1674651604338.prototype.down = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking_picked_user\" DROP CONSTRAINT \"FK_811bcdf2fdbd98b6c4747ffd1d9\"\n        ")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking_picked_user\" DROP CONSTRAINT \"FK_e15779c72233ac86e00141c6dc7\"\n        ")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking_owned_by_user\" DROP CONSTRAINT \"FK_6f4ba243ddc99877b5dcf084430\"\n        ")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking_owned_by_user\" DROP CONSTRAINT \"FK_8eb1a96748ecff50d85228d0f5d\"\n        ")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"matching_event_participants_user\" DROP CONSTRAINT \"FK_ac6266dd42ee1c753781bde9836\"\n        ")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"matching_event_participants_user\" DROP CONSTRAINT \"FK_8ec823fe2047e24fa3e85390b93\"\n        ")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"picking\" DROP CONSTRAINT \"FK_c810aa9c2884f17395d27ea6f82\"\n        ")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            ALTER TABLE \"photo\" DROP CONSTRAINT \"FK_4494006ff358f754d07df5ccc87\"\n        ")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            DROP INDEX \"public\".\"IDX_811bcdf2fdbd98b6c4747ffd1d\"\n        ")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            DROP INDEX \"public\".\"IDX_e15779c72233ac86e00141c6dc\"\n        ")];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            DROP TABLE \"picking_picked_user\"\n        ")];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            DROP INDEX \"public\".\"IDX_6f4ba243ddc99877b5dcf08443\"\n        ")];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            DROP INDEX \"public\".\"IDX_8eb1a96748ecff50d85228d0f5\"\n        ")];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            DROP TABLE \"picking_owned_by_user\"\n        ")];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            DROP INDEX \"public\".\"IDX_ac6266dd42ee1c753781bde983\"\n        ")];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            DROP INDEX \"public\".\"IDX_8ec823fe2047e24fa3e85390b9\"\n        ")];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            DROP TABLE \"matching_event_participants_user\"\n        ")];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            DROP TABLE \"picking\"\n        ")];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            DROP TABLE \"matching_event\"\n        ")];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            DROP TABLE \"photo\"\n        ")];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n            DROP TABLE \"user\"\n        ")];
                    case 21:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return createTableMatchingEvent1674651604338;
}());
exports.createTableMatchingEvent1674651604338 = createTableMatchingEvent1674651604338;
