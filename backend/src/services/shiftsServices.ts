import { addDays, format } from "date-fns";
import * as shiftModel from "../models/shiftModel.js";
import { ModifyShiftFields } from "../types/ModifyShiftFieldsType.js";
import { Shift } from "../types/Shift.js";
import AppError from "../errors/AppError.js";
import * as userModel from "../models/userModel.js";
import { ShiftRequestType } from "../types/ShiftRequestType.js";
import { isValidTime } from "../helpers/isValidTime.js";

export async function generateShiftsForDateRange(): Promise<void> {
  const startDateToGenerateShift = format(new Date(), "yyyy-MM-dd");
  const endDateToGenerateShift = format(addDays(new Date(), 14), "yyyy-MM-dd");

  await shiftModel.generateShiftsForDateRange(
    startDateToGenerateShift,
    endDateToGenerateShift,
  );
}

export async function modifyShift(
  shiftId: string,
  fieldsToUpdate: ModifyShiftFields,
): Promise<Shift> {
  const allowedFields = ["scheduled_start_time", "scheduled_end_time"];

  if (!shiftId) {
    throw new AppError("Shift ID is required", 400);
  }
  const providedFields = Object.keys(fieldsToUpdate);
  const providedValues = Object.values(fieldsToUpdate);

  if (providedFields.length === 0) {
    throw new AppError("No fields provided for update", 400);
  }

  const invalidFields = providedFields.filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length > 0) {
    throw new AppError(
      `Invalid fields provided for update: ${invalidFields.join(", ")}`,
      400,
    );
  }
  if (!providedValues.every(isValidTime)) {
    throw new AppError("Invalid time format. Please use HH:mm format.", 400);
  }

  const shift = await shiftModel.getShiftById(shiftId);
  if (!shift) {
    throw new AppError(`Shift with ID ${shiftId} not found`, 404);
  }

  const { scheduled_start_time, scheduled_end_time } = shift;

  const finalStartTime =
    fieldsToUpdate.scheduled_start_time ?? scheduled_start_time;
  const finalEndTime = fieldsToUpdate.scheduled_end_time ?? scheduled_end_time;

  if (finalStartTime >= finalEndTime) {
    throw new AppError(
      "scheduled_start_time must be earlier than scheduled_end_time",
      400,
    );
  }

  return shiftModel.modifyShift(shiftId, fieldsToUpdate);
}

export async function getRequestsForShift(shiftId: string) {
  if (!shiftId) {
    throw new AppError("Shift ID is required", 400);
  }

  const shift = await shiftModel.getShiftById(shiftId);
  if (!shift) {
    throw new AppError(`Shift with ID ${shiftId} not found`, 404);
  }

  return await shiftModel.getRequestsForShift(shiftId);
}

export async function getShiftRequest(
  shiftId: string,
  userId: string,
): Promise<ShiftRequestType> {
  const user = await userModel.getUserById(userId);
  if (!user) {
    throw new AppError(`User with ID ${userId} not found`, 404);
  }

  const shift = await shiftModel.getShiftById(shiftId);
  if (!shift) {
    throw new AppError(`Shift with ID ${shiftId} not found`, 404);
  }

  return await shiftModel.getShiftRequest(shiftId, userId);
}
export async function createShiftRequest(shiftId: string, userId: string) {
  const shift = await shiftModel.getShiftById(shiftId);
  if (!shift) {
    throw new AppError(`Shift with ID ${shiftId} not found`, 404);
  }
  const user = await userModel.getUserById(userId);
  if (!user) {
    throw new AppError(`User with ID ${userId} not found`, 404);
  }
  if (!user.is_active) {
    throw new AppError(
      `User with ID ${userId} is not active and cannot request shifts`,
      400,
    );
  }

  //   Directly call model because we verified the user and shift exist, so no need to call service again
  const shiftRequest = await shiftModel.getShiftRequest(shiftId, userId);

  if (shiftRequest != null) {
    throw new AppError(
      `User with ID ${userId} has already requested this shift`,
      400,
    );
  }
  return shiftModel.createShiftRequest(
    shiftId,
    userId,
    user.default_hourly_rate,
  );
}

export async function getAssignmentsForShift(shiftId: string) {
  const shift = await shiftModel.getShiftById(shiftId);

  if (!shift) {
    throw new AppError(`Shift with ID ${shiftId} not found`, 404);
  }

  return await shiftModel.getAssignmentsForShift(shiftId);
}

export async function createAssignmentForShift(
  shiftId: string,
  userId: string,
) {
  const shift = await shiftModel.getShiftById(shiftId);
  if (!shift) {
    throw new AppError(`Shift with ID ${shiftId} not found`, 404);
  }
  const user = await userModel.getUserById(userId);

  if (!user) {
    throw new AppError(`User with ID ${userId} not found`, 404);
  }

  if (!user.is_active) {
    throw new AppError(
      `User with ID ${userId} is not active and cannot be assigned to shifts`,
      400,
    );
  }

  const shiftAssignment = await shiftModel.getShiftAssignment(shiftId, userId);
  if (shiftAssignment) {
    throw new AppError(
      `User with ID ${userId} is already assigned to shift with ID ${shiftId}`,
      409,
    );
  }

  return shiftModel.createAssignmentForShift(
    shiftId,
    userId,
    user.default_hourly_rate,
  );
}

export async function deleteShiftAssignment(shiftId: string, userId: string) {
  const deletedAssignment = shiftModel.deleteShiftAssignment(shiftId, userId);

  if (!deletedAssignment) {
    throw new AppError(
      `Shift assignment for shift ID ${shiftId} and user ID ${userId} not found`,
      404,
    );
  }
  return deletedAssignment;
}
