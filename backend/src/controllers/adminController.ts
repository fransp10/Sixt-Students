import { Request, Response } from "express";
import * as adminService from "../services/adminServices.js";
export async function getAdminStats(
  req: Request,
  res: Response,
): Promise<void> {
  const stats = await adminService.getAdminStats();

  res.status(200).json(stats);
}
