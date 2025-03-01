"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthInteractor = void 0;
const tsyringe_1 = require("tsyringe");
const customError_1 = __importDefault(require("../errors/customError"));
const httpStatusCodes_1 = __importDefault(require("../errors/httpStatusCodes"));
const mongodb_1 = require("mongodb");
const bcrypt = __importStar(require("bcrypt"));
const userSchema_1 = require("../validation/schemas/userSchema");
let AuthInteractor = class AuthInteractor {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async signup(user) {
        try {
            const validationResult = userSchema_1.userSchema.validate(user, { abortEarly: false });
            if (validationResult.error) {
                const errors = validationResult.error.details.map(detail => ({
                    message: detail.message,
                    field: detail.path.join('.')
                }));
                throw new customError_1.default("Validation failed", httpStatusCodes_1.default.BAD_REQUEST, { errors });
            }
            const existingUsername = await this.repository.getUserByUsername(user.username);
            if (existingUsername) {
                throw new customError_1.default("Username already exists", httpStatusCodes_1.default.BAD_REQUEST, { field: 'username' });
            }
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const userToCreate = { ...user, password: hashedPassword };
            const newUser = await this.repository.createUser(userToCreate);
            return newUser;
        }
        catch (error) {
            if (error instanceof mongodb_1.MongoError && error.code === 11000) {
                throw new customError_1.default("User with this email already exists", httpStatusCodes_1.default.CONFLICT, { field: "email" });
            }
            throw error instanceof customError_1.default
                ? error
                : new customError_1.default(error instanceof Error ? error.message : "Unknown error", httpStatusCodes_1.default.INTERNAL_SERVER);
        }
    }
};
exports.AuthInteractor = AuthInteractor;
exports.AuthInteractor = AuthInteractor = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IAuthRepository')),
    __metadata("design:paramtypes", [Object])
], AuthInteractor);
