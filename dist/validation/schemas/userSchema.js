"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string()
        .min(6)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
        .required()
        .messages({
        'string.min': 'Password must be at least 6 characters',
        'string.pattern.base': 'Password must contain uppercase, lowercase, numbers, and special characters',
        'any.required': 'Password is required'
    }),
    username: joi_1.default.string()
        .min(3)
        .max(30)
        .required()
        .messages({
        'string.min': 'Username must be at least 3 characters',
        'string.max': 'Username cannot exceed 30 characters',
        'any.required': 'Username is required'
    }),
    profilePicture: joi_1.default.string().uri().optional(),
    profession: joi_1.default.string().max(50).optional(),
    bio: joi_1.default.string().max(500).optional()
});
