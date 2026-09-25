import { Request, Response } from "express";
import * as shiftModel from "../models/shiftModel.js";
import { Shift } from "../types/Shift.js";
import AppError from "../errors/AppError.js";
import { ModifyShiftFields } from "../types/ModifyShiftFields.js";
import * as shiftsServices from "../services/shiftsServices.js";

type getAllShiftsQuerryWordsType = {
  startDate?: string | undefined;
  endDate?: string | undefined;
};
export async function getAllShiftsWithShiftRequestsBetweenDates(
  req: Request<{}, unknown, {}, getAllShiftsQuerryWordsType>,
  res: Response,
): Promise<void> {
  const { startDate, endDate } = req.query;

  const shifts = await shiftsServices.getAllShiftsWithShiftRequestsBetweenDates(
    startDate,
    endDate,
  );

  res.status(200).json(shifts);
}

export async function getShiftById(
  req: Request<{ shiftId: string }>,
  res: Response,
): Promise<void> {
  const { shiftId } = req.params;
  const shift = await shiftModel.getShiftById(shiftId);

  if (!shift) {
    throw new AppError(`Shift with ID ${shiftId} not found`, 404);
  }
  res.status(200).json(shift);
}

export async function modifyShift(
  req: Request<{ shiftId: string }, unknown, ModifyShiftFields>,
  res: Response,
): Promise<void> {
  const { shiftId } = req.params;

  const modifiedShift = await shiftsServices.modifyShift(shiftId, req.body);

  res.status(200).json(modifiedShift);
}

export async function getRequestsForShift(
  req: Request<{ shiftId: string }>,
  res: Response,
): Promise<void> {
  const { shiftId } = req.params;

  const shiftRequests = await shiftsServices.getRequestsForShift(shiftId);

  res.status(200).json(shiftRequests);
}

export async function createShiftRequest(
  req: Request<{ shiftId: string }>,
  res: Response,
): Promise<void> {
  const { shiftId } = req.params;
  const userId = req.user!.id;

  const shiftRequest = await shiftsServices.createShiftRequest(shiftId, userId);
  res.status(201).json(shiftRequest);
}

export async function deleteShiftRequest(
  req: Request<{ shiftId: string }>,
  res: Response,
): Promise<void> {
  const { shiftId } = req.params;
  const userId = req.user!.id;

  const shiftRequest = await shiftsServices.getShiftRequest(shiftId, userId);
  if (!shiftRequest) {
    throw new AppError(
      `Shift request for shift ID ${shiftId} and user ID ${userId} not found`,
      404,
    );
  }

  const deletedShift = await shiftModel.deleteShiftRequest(shiftId, userId);
  res.status(200).json(deletedShift);
}

export async function getAllAssignmentsForShift(
  req: Request<{ shiftId: string }>,
  res: Response,
) {
  const { shiftId } = req.params;

  const shiftAssignments = await shiftsServices.getAssignmentsForShift(shiftId);

  res.status(200).json(shiftAssignments);
}

export async function createAssignmentForShift(
  req: Request<{ shiftId: string }>,
  res: Response,
): Promise<void> {
  const { shiftId } = req.params;
  const userId = req.body!.userId;

  const newAssignment = await shiftsServices.createAssignmentForShift(
    shiftId,
    userId,
  );

  res.status(201).json(newAssignment);
}

export async function createAssignmentForShiftAdmin(
  req: Request<{ shiftId: string }, unknown, { userId: string }>,
  res: Response,
): Promise<void> {
  const { shiftId } = req.params;
  const { userId } = req.body;

  const newAssignment = await shiftsServices.createAssignmentForShift(
    shiftId,
    userId,
  );
}

export async function deleteShiftAssignmentAdmin(
  req: Request<{ shiftId: string }, unknown, { userId: string }>,
  res: Response,
): Promise<void> {
  const { shiftId } = req.params;
  const { userId } = req.body;

  const deletedAssignment = await shiftsServices.deleteShiftAssignment(
    shiftId,
    userId,
  );

  res.status(200).json(deletedAssignment);
}
