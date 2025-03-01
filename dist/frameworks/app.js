"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = __importDefault(require("./routes/router"));
const customError_1 = __importDefault(require("../errors/customError"));
dotenv_1.default.config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', router_1.default);
app.use((err, req, res, next) => {
    if (err instanceof customError_1.default) {
        res.status(err.statusCode).json(err.toJSON());
    }
    else {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = app;
