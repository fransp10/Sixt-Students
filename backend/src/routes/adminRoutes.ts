import express from "express";
import * as adminController from "../controllers/adminController.js";
export const adminRouter = express.Router();

adminRouter.get("/stats", adminController.getAdminStats);
