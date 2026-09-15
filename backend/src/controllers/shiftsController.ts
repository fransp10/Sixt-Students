import { Request, Response } from "express";
import * as shiftModel from "../models/shiftModel.js";
import { Shift } from "../types/Shift.js";
import AppError from "../errors/AppError.js";

type getAllShiftsQuerryWordsType = { startDate?: string; endDate?: string };
export async function getAllShifts(
  req: Request<{}, unknown, {}, getAllShiftsQuerryWordsType>,
  res: Response,
): Promise<void> {
  const { startDate, endDate } = req.query;

  if ((startDate && !endDate) || (!startDate && endDate)) {
    throw new AppError("Both startDate and endDate must be provided", 400);
  }

  let shifts: Shift[];
  if (startDate && endDate) {
    shifts = await shiftModel.getShiftsBetweenDates(startDate, endDate);
  } else {
    shifts = await shiftModel.getAllShifts();
  }

  res.status(200).json(shifts);
}
