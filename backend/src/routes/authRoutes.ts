import express from "express";
import * as authController from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";

export const authRouter = express.Router();

authRouter.post("/login", authController.loginUser);

authRouter.post("/logout", authenticate, authController.logoutUser);

authRouter.post("/reset-password", authController.resetPassword);

authRouter.post("/reset-password/validate", authController.validateResetToken);
