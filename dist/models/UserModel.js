"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    profilePicture: { type: String, required: false },
    profession: { type: String, required: false },
    bio: { type: String, required: false }
});
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
