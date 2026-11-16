import express from "express";
import * as authController from "../controllers/authController.js";

export const authRouter = express.Router();

authRouter.post("/login", authController.loginUser);

authRouter.post("/logout", authController.logoutUser);

authRouter.post("/reset-password", authController.resetPassword);

authRouter.post("/reset-password/validate", authController.validateResetToken);
authRouter.post("/refresh-token", authController.refreshToken);
