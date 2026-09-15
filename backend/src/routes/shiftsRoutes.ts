import express from "express";
import { getAllShifts } from "../controllers/shiftsController.js";

const shiftsRouter = express.Router();

shiftsRouter.get("/", getAllShifts);

export default shiftsRouter;
