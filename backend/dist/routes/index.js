"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const survey_routes_1 = __importDefault(require("./survey.routes"));
const appRoute = (0, express_1.Router)();
appRoute.use("/user", user_routes_1.default);
appRoute.use("/survey", survey_routes_1.default);
exports.default = appRoute;
