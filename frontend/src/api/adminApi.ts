import { axiosClient } from "./axios";

export async function getAdminStats() {
  const adminStats = await axiosClient.get("/admin/stats");

  return adminStats.data;
}

export type MonthlyTotals = {
  month: string; // Format: YYYY-MM
  hours: number;
  payroll: number;
};

export async function getMonthlyTotals(
  months: number,
): Promise<MonthlyTotals[]> {
  const monthlyTotals = await axiosClient.get("/admin/monthly-totals", {
    params: { months },
  });

  return monthlyTotals.data as MonthlyTotals[];
}
