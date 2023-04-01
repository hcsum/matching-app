"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_source_1 = __importDefault(require("../../data-source"));
var model_1 = require("./model");
var UserRepository = data_source_1.default.getRepository(model_1.User);
exports.default = UserRepository;
