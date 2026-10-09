import express from "express";
import * as meController from "../controllers/meController.js";
export const meRouter = express.Router();

meRouter.get("/", meController.checkMe);

meRouter.get("/requests", meController.getMyShiftRequests);
meRouter.post("/:shiftId/request", meController.requestShift);
meRouter.delete("/:shiftId/request", meController.deleteShiftRequest);
meRouter.patch("/", meController.updateMyInfo);
meRouter.patch("/password", meController.updateMyPassword);
meRouter.get("/stats", meController.getMyStats);
meRouter.get("/assignments", meController.getMyShiftAssignments);
meRouter.get("/assignments/next", meController.getNextShift);
meRouter.get("/race", meController.getRaceStats);
meRouter.get("/race/months", meController.getRaceMonths);
meRouter.get("/goal", meController.getMyGoal);
meRouter.patch("/goal", meController.updateMyGoal);
