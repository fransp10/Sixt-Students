import express from "express";
import * as meController from "../controllers/meController.js";
export const meRouter = express.Router();

meRouter.get("/", meController.checkMe);

meRouter.get("/requests", meController.getMyShiftRequests);
meRouter.post("/:shiftId/request", meController.requestShift);
meRouter.delete("/:shiftId/request", meController.deleteShiftRequest);

meRouter.get("/assignments", meController.getMyShiftAssignments);
