import type { RecentStudent } from "../types/recentSudent";
import type { DeletableStudent } from "../types/deletableStudent";
import { axiosClient } from "./axios";
import type {
  Contract,
  ContractsWithoutSignedUrl,
  ContractWithUrl,
} from "../types/contracts";
import type { Payroll } from "../types/payroll";
import type { AppSettings } from "../types/appSettings";

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

export async function getStudentContracts(month?: string): Promise<Contract[]> {
  if (month) {
    return axiosClient
      .get(`/admin/contracts?month=${month}`)
      .then((res) => res.data as Contract[]);
  }

  const studentContracts = await axiosClient.get(`/admin/contracts`);

  return studentContracts.data as Contract[];
}

// every contract one student has uploaded, any month
export async function getContractsOfStudent(
  userId: number,
): Promise<ContractsWithoutSignedUrl[]> {
  const contracts = await axiosClient.get(
    `/admin/students/${userId}/contracts`,
  );

  return contracts.data as ContractsWithoutSignedUrl[];
}

export async function getStudentContractWithSignedUrl(
  contractId: number,
  download: boolean = false,
): Promise<ContractWithUrl> {
  const contractWithSignedUrl = await axiosClient.get(
    `/admin/contracts/${contractId}?download=${download}`,
  );

  return contractWithSignedUrl.data as ContractWithUrl;
}

export async function getPayroll(month: string): Promise<Payroll> {
  const payroll = await axiosClient.get("/admin/payroll", {
    params: { month },
  });

  return payroll.data as Payroll;
}

// the budget carries over to the following months until it's changed again
export async function updatePayrollBudget(
  month: string,
  amount: number,
): Promise<void> {
  await axiosClient.put(`/admin/payroll/${month}/budget`, { amount });
}

export async function getAppSettings(): Promise<AppSettings> {
  const settings = await axiosClient.get("/admin/settings");

  return settings.data as AppSettings;
}

export async function updateAppSettings(
  updates: Partial<AppSettings>,
): Promise<AppSettings> {
  const settings = await axiosClient.patch("/admin/settings", updates);

  return settings.data as AppSettings;
}

export async function markPayrollPaid(month: string): Promise<void> {
  await axiosClient.post(`/admin/payroll/${month}/paid`);
}

export async function markStudentPaid(
  month: string,
  userId: number,
): Promise<void> {
  await axiosClient.post(`/admin/payroll/${month}/students/${userId}/paid`);
}

export async function unmarkStudentPaid(
  month: string,
  userId: number,
): Promise<void> {
  await axiosClient.delete(`/admin/payroll/${month}/students/${userId}/paid`);
}

export async function unmarkPayrollPaid(month: string): Promise<void> {
  await axiosClient.delete(`/admin/payroll/${month}/paid`);
}

// without userIds the backend reminds every student missing a contract for that month
export async function sendContractReminders(
  month: string,
  userIds?: number[],
): Promise<{ sent: number }> {
  const reminders = await axiosClient.post("/admin/students/contracts/remind", {
    studentIds: userIds,
    month,
  });

  return reminders.data as { sent: number };
}
