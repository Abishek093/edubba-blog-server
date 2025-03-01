"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const tsyringe_1 = require("tsyringe");
const UserModel_1 = require("./models/UserModel");
const customError_1 = __importDefault(require("../../errors/customError"));
const mongodb_1 = require("mongodb");
const httpStatusCodes_1 = __importDefault(require("../../errors/httpStatusCodes"));
let AuthRepository = class AuthRepository {
    async getUserByUsername(username) {
        try {
            const existingUsername = await UserModel_1.UserModel.findOne({ username: username });
            if (existingUsername) {
                return true;
            }
            return false;
        }
        catch (error) {
            throw new customError_1.default(error, httpStatusCodes_1.default.INTERNAL_SERVER);
        }
    }
    async getUserByMail(email) {
        try {
            const existingUser = await UserModel_1.UserModel.findOne({ email });
            if (!existingUser)
                return null;
            return {
                email: existingUser.email,
                username: existingUser.username,
                profilePicture: existingUser.profilePicture,
                profession: existingUser.profession,
                bio: existingUser.bio,
            };
        }
        catch (error) {
            throw new customError_1.default(error, httpStatusCodes_1.default.INTERNAL_SERVER);
        }
    }
    async createUser(user) {
        try {
            const userDoc = new UserModel_1.UserModel(user);
            const savedUser = await userDoc.save();
        }
        catch (error) {
            if (error instanceof mongodb_1.MongoError && error.code === 11000) {
                throw new customError_1.default("User with this email already exists", httpStatusCodes_1.default.CONFLICT, { field: "email" });
            }
            throw new customError_1.default(error, httpStatusCodes_1.default.INTERNAL_SERVER);
        }
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, tsyringe_1.injectable)()
], AuthRepository);
