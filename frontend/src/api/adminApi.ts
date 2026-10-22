import type { RecentStudent } from "../types/recentSudent";
import type { DeletableStudent } from "../types/deletableStudent";
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

export async function getRecentStudents(
  limit: number,
): Promise<RecentStudent[]> {
  const recentStudents = await axiosClient.get("/admin/recent-students", {
    params: { limit },
  });

  return recentStudents.data as RecentStudent[];
}

export async function getDeletableStudents(): Promise<DeletableStudent[]> {
  const deletableStudents = await axiosClient.get("/admin/deletable-students");

  return deletableStudents.data as DeletableStudent[];
}

export async function deleteStudent(studentId: number): Promise<void> {
  await axiosClient.delete(`/admin/students/${studentId}`);
}
