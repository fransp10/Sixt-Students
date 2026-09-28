import express from "express";
import * as shiftController from "../controllers/shiftsController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const shiftsRouter = express.Router();

shiftsRouter.get(
  "/",
  shiftController.getAllShiftsWithShiftRequestsBetweenDates,
);
shiftsRouter.patch("/:shiftId", requireAdmin, shiftController.modifyShift);

shiftsRouter.get("/:shiftId/requests", shiftController.getRequestsForShift);
shiftsRouter.post("/:shiftId/requests", shiftController.createShiftRequest);
shiftsRouter.delete("/:shiftId/requests", shiftController.deleteShiftRequest);

// assignments

shiftsRouter.get(
  "/:shiftId/assignments",
  shiftController.getAllAssignmentsForShift,
);
shiftsRouter.post(
  "/:shiftId/assignments",
  requireAdmin,
  shiftController.createAssignmentForShift,
);
shiftsRouter.delete(
  "/:shiftId/assignments",
  requireAdmin,
  shiftController.deleteShiftAssignedAdmin,
);

shiftsRouter.patch(
  "/:shiftId/assignments",
  requireAdmin,
  shiftController.modifyShiftAssignedAdmin,
);
export default shiftsRouter;
