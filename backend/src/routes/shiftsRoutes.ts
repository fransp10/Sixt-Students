import express from "express";
import {
  createAssignmentForShift,
  createShiftRequest,
  deleteShiftAssignment,
  deleteShiftRequest,
  getAllAssignmentsForShift,
  getAllShifts,
  getRequestsForShift,
  modifyShift,
} from "../controllers/shiftsController.js";

const shiftsRouter = express.Router();

shiftsRouter.get("/", getAllShifts);

shiftsRouter.patch("/:shiftId", modifyShift);

shiftsRouter.get("/:shiftId/requests", getRequestsForShift);
shiftsRouter.post("/:shiftId/requests", createShiftRequest);
shiftsRouter.delete("/:shiftId/requests", deleteShiftRequest);

// assignments

shiftsRouter.get("/:shiftId/assignments", getAllAssignmentsForShift);
shiftsRouter.post("/:shiftId/assignments", createAssignmentForShift);
shiftsRouter.delete("/:shiftId/assignments", deleteShiftAssignment);

export default shiftsRouter;
