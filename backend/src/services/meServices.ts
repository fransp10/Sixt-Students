import AppError from "../errors/AppError.js";
import { getUserById } from "../models/userModel.js";
import * as shiftModel from "../models/shiftModel.js";

export async function checkMe(userId: string) {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}

export async function requestShift(userId: string, shiftId: string) {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }
  const shift = await shiftModel.getShiftById(shiftId);

  if (!shift) {
    throw new AppError("Shift not found", 404);
  }

  const newShiftRequest = await shiftModel.createShiftRequest(
    userId,
    shiftId,
    user.default_hourly_rate,
  );

  return newShiftRequest;
}

export async function getShiftAssignmentsByIdBetweenDates(
  userId: string,
  startDate?: string,
  endDate?: string,
) {
  const shiftAssignments = await shiftModel.getShiftAssignmentsByIdBetweenDates(
    userId,
    startDate,
    endDate,
  );
  return shiftAssignments;
}
