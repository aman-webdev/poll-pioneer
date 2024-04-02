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
exports.hashString = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = require("dotenv");
const bcrypt_1 = __importDefault(require("bcrypt"));
(0, dotenv_1.config)();
const SECRET = process.env.JWT_SECRET || 'Secret';
const TOKEN_EXPIRY = '1hr';
const generateToken = (userId) => {
    return (0, jsonwebtoken_1.sign)({ userId }, SECRET, { expiresIn: TOKEN_EXPIRY });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const data = (0, jsonwebtoken_1.verify)(token, SECRET);
        return data;
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.verifyToken = verifyToken;
const hashString = (str) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = yield bcrypt_1.default.hash(str, 10);
    return hash;
});
exports.hashString = hashString;
