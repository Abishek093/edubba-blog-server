"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const AuthController_1 = require("../../adapters/controllers/AuthController");
const authRoutes = (0, express_1.Router)();
const authController = tsyringe_1.container.resolve(AuthController_1.AuthController);
authRoutes.post('/signup', authController.signup);
exports.default = authRoutes;
