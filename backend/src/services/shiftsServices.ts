import { addDays, format } from "date-fns";
import * as shiftModel from "../models/shiftModel.js";
export async function generateShiftsForDateRange(): Promise<void> {
  const startDateToGenerateShift = format(new Date(), "yyyy-MM-dd");
  const endDateToGenerateShift = format(addDays(new Date(), 14), "yyyy-MM-dd");

  await shiftModel.generateShiftsForDateRange(
    startDateToGenerateShift,
    endDateToGenerateShift,
  );
}
