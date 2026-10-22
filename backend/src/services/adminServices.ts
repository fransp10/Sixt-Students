import { adminStats } from "../types/adminStats.js";
import * as adminModel from "../models/adminModel.js";
import { monthlyTotals } from "../types/monthlyTotals.js";
import { recentStudent } from "../types/recentStudent.js";
import AppError from "../errors/AppError.js";
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

export async function getRecentStudents(
  limit: number = 10,
): Promise<recentStudent[]> {
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    throw new AppError("Limit must be a whole number between 1 and 50", 400);
  }

  const recentStudents = await adminModel.getRecentStudents(limit);

  return recentStudents;
}

export async function deleteStudent(id: number): Promise<void> {
  if (!id) {
    throw new AppError("Student ID is required", 400);
  }

  const student = await adminModel
    .getDeletableStudents()
    .then((students) => students.find((s) => s.id === id));

  if (!student) {
    throw new AppError("Student not found or cannot be deleted", 404);
  }

  await adminModel.deleteStudent(id);
}
