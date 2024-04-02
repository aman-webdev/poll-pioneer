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
const auth_1 = require("../utils/auth");
const userRouter = (0, express_1.Router)();
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Required Params not found" });
    const hashedPass = yield (0, auth_1.hashString)(password);
    const isExists = yield client_1.default.user.findUnique({ where: {
            email, password: hashedPass
        } });
    if (!isExists)
        return res.status(409).json({ message: "email / password incorrect" });
    const token = (0, auth_1.generateToken)(isExists.id);
    return res.status(200).json({ message: "Signin successful", data: {
            id: isExists, token
        } });
});
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({ message: "Required Params not found" });
    const isExists = yield client_1.default.user.findUnique({ where: {
            username: email
        } });
    if (isExists)
        return res.status(409).json({ message: "username already exists" });
    const hashedPass = yield (0, auth_1.hashString)(password);
    const { id } = yield client_1.default.user.create({
        data: Object.assign(Object.assign({}, req.body), { password: hashedPass }),
        select: {
            id: true
        }
    });
    const token = (0, auth_1.generateToken)(id);
    return res.status(201).json({ message: "Signup successful", data: {
            id, token
        } });
});
userRouter.post("/signin", signin);
userRouter.post("/signup", signup);
exports.default = userRouter;
