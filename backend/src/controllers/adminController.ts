import { Request, Response } from "express";
import * as adminService from "../services/adminServices.js";
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
