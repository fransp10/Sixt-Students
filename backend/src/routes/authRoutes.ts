import express from "express";
import * as authController from "../controllers/authController.js";
import {
  loginLimiter,
  refreshTokenLimiter,
  resetPasswordLimiter,
  validationLimiter,
} from "../middleware/rateLimiters.js";
import { blockInDemo } from "../middleware/blockInDemo.js";

export const authRouter = express.Router();

authRouter.post("/login", loginLimiter, authController.loginUser);

authRouter.post("/logout", authController.logoutUser);

authRouter.post(
  "/reset-password",
  blockInDemo,
  resetPasswordLimiter,
  authController.resetPassword,
);

authRouter.post(
  "/reset-password/validate",
  validationLimiter,
  authController.validateResetToken,
);
authRouter.post(
  "/refresh-token",
  refreshTokenLimiter,
  authController.refreshToken,
);
