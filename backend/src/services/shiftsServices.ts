import { addDays, endOfWeek, format } from "date-fns";
import * as shiftModel from "../models/shiftModel.js";
import { ModifyShiftFields } from "../types/ModifyShiftFields.js";
import {
  AggregatedShiftWithStudents,
  Shift,
  ShiftWithStudentsAndRequesters,
} from "../types/Shift.js";
import AppError from "../errors/AppError.js";
import * as userModel from "../models/userModel.js";
import { ShiftRequestType } from "../types/ShiftRequestType.js";
import { isValidTime } from "../helpers/isValidTime.js";

export async function generateShiftsForDateRange(): Promise<void> {
  const startDateToGenerateShift = format(new Date(), "yyyy-MM-dd");
  const endDateToGenerateShift = format(
    endOfWeek(addDays(new Date(), 21), { weekStartsOn: 1 }),
    "yyyy-MM-dd",
  );

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

  const requests = await shiftModel.getRequestsForShift(shiftId);
  //  {
  //         "shift_id": 51708,
  //         "user_id": 8,
  //         "request_created_at": "2026-09-17T14:04:15.425Z",
  //         "username": "admin",
  //         "first_name": "Fran",
  //         "last_name": "Sipek"
  //     }
  const studentsRequestingShift = {
    shift_id: shiftId,
    students: requests.map((request) => ({
      user_id: request.user_id,
      username: request.username,
      first_name: request.first_name,
      last_name: request.last_name,
      request_created_at: request.request_created_at,
    })),
  };

  return studentsRequestingShift;
}

export async function getShiftRequest(
  shiftId: string,
  userId: string,
): Promise<ShiftRequest> {
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
  console.log(shift);
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

export async function getAllShiftsWithShiftRequestsBetweenDates(
  startDate: string | undefined,
  endDate: string | undefined,
): Promise<ShiftWithStudentsAndRequesters[]> {
  const shifts = await shiftModel.getAllShiftsWithShiftRequestsBetweenDates(
    startDate,
    endDate,
  );

  // const shiftsMap = new Map<number, AggregatedShiftWithStudents>();

  // for (const row of shifts) {
  //   if (!shiftsMap.has(row.shift_id)) {
  //     shiftsMap.set(row.shift_id, {
  //       id: row.shift_id,
  //       date: row.date,
  //       shift_type: row.shift_type,
  //       scheduled_start_time: row.scheduled_start_time,
  //       scheduled_end_time: row.scheduled_end_time,
  //       students: [],
  //     });
  //   }
  //   if (row.user_id) {
  //     shiftsMap.get(row.shift_id)!.students.push({
  //       id: row.user_id,
  //       first_name: row.first_name!,
  //       last_name: row.last_name!,
  //     });
  //   }
  return shifts;
}
