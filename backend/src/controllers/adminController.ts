import { Request, Response } from "express";
import * as adminService from "../services/adminServices.js";
import * as adminModel from "../models/adminModel.js";
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

export async function getContract(
  req: Request<{ contractId: string }, unknown, unknown, { download?: string }>,
  res: Response,
): Promise<void> {
  const { contractId } = req.params;
  const download = req.query.download === "true";
  const contract = await adminService.getContract(contractId, download);

  res.status(200).json(contract);
}
