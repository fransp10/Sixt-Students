import { Request, Response } from "express";
import * as adminService from "../services/adminServices.js";
import * as adminModel from "../models/adminModel.js";
import { AppSettings } from "../types/appSettings.js";
export async function getAdminStats(
  req: Request,
  res: Response,
): Promise<void> {
  const stats = await adminService.getAdminStats();

  res.status(200).json(stats);
}

export async function getMonthlyTotals(
  req: Request<{}, {}, {}, { months: string }>,
  res: Response,
): Promise<void> {
  const { months } = req.query;

  const monthlyTotals = await adminService.getMonthlyTotals(
    parseInt(months, 10),
  );

  res.status(200).json(monthlyTotals);
}

export async function getRecentStudents(
  req: Request<{}, {}, {}, { limit?: string }>,
  res: Response,
): Promise<void> {
  const { limit } = req.query;

  const recentStudents = await adminService.getRecentStudents(
    limit === undefined ? undefined : Number(limit),
  );

  res.status(200).json(recentStudents);
}

export async function getDeletableStudents(
  req: Request,
  res: Response,
): Promise<void> {
  const deletableStudents = await adminModel.getDeletableStudents();

  res.status(200).json(deletableStudents);
}

export async function deleteStudent(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const { id } = req.params;

  await adminService.deleteStudent(Number(id));

  res.status(204).send();
}

export async function getContracts(
  req: Request<{}, unknown, unknown, { month?: string }>,
  res: Response,
): Promise<void> {
  const { month } = req.query;
  const contracts = await adminService.getContracts(month);

  res.status(200).json(contracts);
}

export async function getStudentContracts(
  req: Request<{ userId: string }>,
  res: Response,
): Promise<void> {
  const { userId } = req.params;
  const contracts = await adminService.getStudentContracts(userId);

  res.status(200).json(contracts);
}

export async function getContract(
  req: Request<{ contractId: string }, unknown, unknown, { download?: string }>,
  res: Response,
): Promise<void> {
  const { contractId } = req.params;
  const download = req.query.download === "true";
  const contract = await adminService.getContract(contractId, download);

  res.status(200).json(contract);
}

export async function sendContractReminder(
  req: Request<{}, unknown, { studentIds?: string[]; month: string }>,
  res: Response,
): Promise<void> {
  const { studentIds, month } = req.body;
  const adminId = req.user!.id;
  const result = await adminService.sendContractReminder(
    adminId,
    month,
    studentIds,
  );

  res.status(200).json(result);
}

export async function getPayroll(
  req: Request<{}, unknown, unknown, { month?: string }>,
  res: Response,
): Promise<void> {
  const { month } = req.query;

  const payrollData = await adminService.getPayroll(month);

  res.status(200).json(payrollData);
}

export async function setPayrollBudget(
  req: Request<{ month: string }, unknown, { amount: number }>,
  res: Response,
): Promise<void> {
  const { month } = req.params;
  const { amount } = req.body;

  await adminService.setPayrollBudget(month, amount);

  res.status(204).send();
}

export async function getAppSettings(
  req: Request,
  res: Response,
): Promise<void> {
  const settings = await adminService.getAppSettings();

  res.status(200).json(settings);
}

export async function updateAppSettings(
  req: Request<{}, unknown, Partial<AppSettings>>,
  res: Response,
): Promise<void> {
  const settings = await adminService.updateAppSettings(req.body);

  res.status(200).json(settings);
}

export async function markPayrollPaid(
  req: Request<{ month: string }>,
  res: Response,
): Promise<void> {
  const { month } = req.params;
  const paidByAdminId = req.user?.id!;
  await adminService.markPayrollPaid(month, paidByAdminId);

  res.status(204).send();
}

export async function markStudentPaid(
  req: Request<{ month: string; userId: string }>,
  res: Response,
): Promise<void> {
  const { month, userId } = req.params;
  const paidByAdminId = req.user?.id!;
  await adminService.markStudentPaid(month, Number(userId), paidByAdminId);

  res.status(204).send();
}

export async function unmarkPayrollPaid(
  req: Request<{ month: string }>,
  res: Response,
): Promise<void> {
  const { month } = req.params;
  await adminService.unmarkPayrollPaid(month);

  res.status(204).send();
}

export async function unmarkStudentPaid(
  req: Request<{ month: string; userId: string }>,
  res: Response,
): Promise<void> {
  const { month, userId } = req.params;
  await adminService.unmarkStudentPaid(month, Number(userId));

  res.status(204).send();
}
