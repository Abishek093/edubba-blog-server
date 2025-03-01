"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const db_1 = __importDefault(require("./config/db"));
const AuthRepository_1 = require("./adapters/repositories/AuthRepository");
async function test() {
    try {
        await (0, db_1.default)();
        const repos = new AuthRepository_1.AuthRepository();
        const exists = await repos.getUserByUsername("hello");
        console.log("User exists:", exists);
    }
    catch (error) {
        console.error("Test failed:", error);
    }
    finally {
        process.exit();
    }
}
test();
