"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
(0, dotenv_1.config)();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/v1", routes_1.default);
app.get("/health", (_, res) => res.send("All Good"));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
