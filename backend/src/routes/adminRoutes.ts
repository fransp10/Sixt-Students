import express from "express";
import * as adminController from "../controllers/adminController.js";
export const adminRouter = express.Router();

adminRouter.get("/stats", adminController.getAdminStats);

adminRouter.get("/monthly-totals", adminController.getMonthlyTotals);

adminRouter.get("/recent-students", adminController.getRecentStudents);

adminRouter.get("/deletable-students", adminController.getDeletableStudents);
adminRouter.delete("/students/:id", adminController.deleteStudent);
