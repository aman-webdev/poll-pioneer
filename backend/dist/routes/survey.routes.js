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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = __importDefault(require("../utils/client"));
const surveyRoute = (0, express_1.Router)();
const createSurvey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, questions, authorId } = req.body;
    console.log(authorId, 'auth id');
    if (!title || !questions)
        return res.status(400).json({ message: "Required parameters not found" });
    const result = yield client_1.default.survey.create({
        data: {
            title,
            description,
            questions,
            authorId
        }
    });
    return res.status(201).json({ message: "Survey created successfully", data: result });
});
const getSurvey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { surveyId } = req.body;
    if (!surveyId)
        return res.status(400).json({ message: "surveyId required" });
    const data = yield client_1.default.survey.findUnique({ where: { id: surveyId },
        select: {
            questions: {
                select: {
                    survey: true,
                    options: {}
                }
            }
        } });
    res.json({ data });
});
surveyRoute.post("/create-survey", createSurvey);
surveyRoute.get("/get", getSurvey);
exports.default = surveyRoute;
