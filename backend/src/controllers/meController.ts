import { Request, Response } from "express";
import * as meServices from "../services/meServices.js";
import * as shiftModel from "../models/shiftModel.js";
import * as userModel from "../models/userModel.js";
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

export async function getMyStats(
  req: Request<{}, unknown, unknown, { startDate?: string; endDate?: string }>,
  res: Response,
) {
  const userId = req.user!.id;
  const { startDate, endDate } = req.query;

  const stats = await meServices.getStatsByUserId(userId, startDate, endDate);

  res.status(200).json(stats);
}

export async function getNextShift(req: Request, res: Response) {
  const userId = req.user!.id;

  const nextShiftAssignment = await userModel.getNextShift(userId);

  res.status(200).json(nextShiftAssignment);
}

export async function getRaceStats(
  req: Request<{}, {}, {}, { month?: string }>,
  res: Response,
) {
  const { month } = req.query;

  const earningsStats = await meServices.getRaceStats(month);

  res.status(200).json(earningsStats);
}

export async function getRaceMonths(req: Request, res: Response) {
  const months = await userModel.getRaceMonths();

  res.status(200).json(months);
}

export async function getMyGoal(
  req: Request<{}, {}, {}, { month: string }>,
  res: Response,
) {
  const userId = req.user!.id;
  const { month } = req.query;

  const goal = await meServices.getMyGoal(userId, month);

  res.status(200).json(goal);
}

export async function updateMyGoal(
  req: Request<{}, {}, { amount: number }>,
  res: Response,
): Promise<void> {
  const userId = req.user!.id;
  const { amount } = req.body;

  const updatedGoal = await meServices.updateMyGoal(userId, amount);

  res.status(200).json(updatedGoal);
}

export async function uploadContract(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user!.id;
  const { month } = req.body;
  const file = req.file;
  await meServices.uploadContract(userId, month, file);

  res.status(201).json({ message: "Contract uploaded successfully" });
}

export async function getMyContracts(
  req: Request<{}, {}, {}, { month: string; download?: string }>,
  res: Response,
): Promise<void> {
  const userId = req.user!.id;
  const { month } = req.query;
  const download = req.query.download === "true";
  const url = await meServices.getMyContract(userId, month, download);

  res.status(200).json({ url });
}
