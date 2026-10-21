import { adminStats } from "../types/adminStats.js";
import * as adminModel from "../models/adminModel.js";
import { monthlyTotals } from "../types/monthlyTotals.js";
export async function getAdminStats(): Promise<adminStats> {
  const activeStudents = await adminModel.getActiveStudentsCount();
  const shiftRequests = await adminModel.getShiftRequestsCount();
  const totalPayroll = await adminModel.getTotalPayroll();

  return {
    activeStudents: activeStudents,
    shiftRequests: shiftRequests,
    totalPayroll: totalPayroll,
  };
}

export async function getMonthlyTotals(
  months: number,
): Promise<monthlyTotals[]> {
  const monthlyTotals = await adminModel.getMonthlyTotals(months);

  return monthlyTotals;
}
