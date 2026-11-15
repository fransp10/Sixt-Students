import express from "express";
import * as adminController from "../controllers/adminController.js";
export const adminRouter = express.Router();

adminRouter.get("/stats", adminController.getAdminStats);

adminRouter.get("/monthly-totals", adminController.getMonthlyTotals);

adminRouter.get("/recent-students", adminController.getRecentStudents);

adminRouter.get("/deletable-students", adminController.getDeletableStudents);
adminRouter.delete("/students/:id", adminController.deleteStudent);
adminRouter.get("/contracts", adminController.getContracts);
adminRouter.get("/contracts/:contractId", adminController.getContract);
adminRouter.get(
  "/students/:userId/contracts",
  adminController.getStudentContracts,
);
adminRouter.post(
  "/students/contracts/remind",
  adminController.sendContractReminder,
);

adminRouter.get("/settings", adminController.getAppSettings);
adminRouter.patch("/settings", adminController.updateAppSettings);

adminRouter.get("/payroll", adminController.getPayroll);
adminRouter.put("/payroll/:month/budget", adminController.setPayrollBudget);
adminRouter.post("/payroll/:month/paid", adminController.markPayrollPaid);
adminRouter.post(
  "/payroll/:month/students/:userId/paid",
  adminController.markStudentPaid,
);
adminRouter.delete("/payroll/:month/paid", adminController.unmarkPayrollPaid);
adminRouter.delete(
  "/payroll/:month/students/:userId/paid",
  adminController.unmarkStudentPaid,
);
