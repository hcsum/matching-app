"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var model_1 = require("./domain/photo/model");
var model_2 = require("./domain/picking/model");
var model_3 = require("./domain/matching-event/model");
var model_4 = require("./domain/user/model");
var AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt((_a = process.env.DB_PORT) !== null && _a !== void 0 ? _a : "5432", 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [model_4.User, model_1.Photo, model_2.Picking, model_3.MatchingEvent],
    synchronize: false,
    migrations: ["".concat(__dirname, "/migrations/*")],
});
exports.default = AppDataSource;
