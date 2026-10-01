import { Request, Response } from "express";
import * as meServices from "../services/meServices.js";
import * as shiftModel from "../models/shiftModel.js";
export async function checkMe(req: Request, res: Response) {
  const userId = req.user!.id;

  const user = await meServices.checkMe(userId);

  res.status(200).json({ user });
}

export async function requestShift(
  req: Request<{ shiftId: string }>,
  res: Response,
) {
  const { shiftId } = req.params;
  const userId = req.user!.id;

  const shiftRequest = await meServices.requestShift(userId, shiftId);

  res.status(201).json({ shiftRequest });
}

export async function deleteShiftRequest(
  req: Request<{ shiftId: string }>,
  res: Response,
) {
  const { shiftId } = req.params;
  const userId = req.user!.id;

  const deletedShift = await shiftModel.deleteShiftRequest(userId, shiftId);

  res
    .status(204)
    .json({ message: "Shift request deleted successfully", deletedShift });
}

export async function getMyShiftAssignments(
  req: Request<{}, unknown, unknown, { startDate?: string; endDate?: string }>,
  res: Response,
) {
  const userId = req.user!.id;
  const { startDate, endDate } = req.query;

  const shiftAssignments = await meServices.getShiftAssignmentsByIdBetweenDates(
    userId,
    startDate,
    endDate,
  );

  res.status(200).json({ shiftAssignments });
}

export async function getMyShiftRequests(req: Request, res: Response) {
  const userId = req.user!.id;

  const shiftRequests = await shiftModel.getShiftRequestsByUserId(userId);

  res.status(200).json({ shiftRequests });
}

export async function updateMyInfo(
  req: Request<{}, unknown, { email?: unknown; phone?: unknown }>,
  res: Response,
) {
  // type checks and normalizing happen in the service
  const { email, phone } = req.body;

  const userId = req.user!.id;
  const updatedUser = await meServices.updateUserInfo(userId, email, phone);

  res.status(200).json(updatedUser);
}

export async function updateMyPassword(
  req: Request<{}, unknown, { currentPassword: string; newPassword: string }>,
  res: Response,
) {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user!.id;

  const updatedUser = await meServices.updateMyPassword(
    userId,
    currentPassword,
    newPassword,
  );
  res.status(200).json(updatedUser);
}
