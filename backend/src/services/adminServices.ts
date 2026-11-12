import { adminStats } from "../types/adminStats.js";
import * as adminModel from "../models/adminModel.js";
import * as userModel from "../models/userModel.js";
import * as emailService from "./emailServices.js";
import { monthlyTotals } from "../types/monthlyTotals.js";
import { recentStudent } from "../types/recentStudent.js";
import AppError from "../errors/AppError.js";
import { format } from "date-fns";
import { isValidMonth } from "../helpers/isValidMonth.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { SIGNED_URL_EXPIRES_IN } from "../helpers/constants.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "../config/s3.js";
import { ContractReminderResult } from "../types/contract.js";
import { Payroll } from "../types/payroll.js";
import { getPayrollStatus } from "../helpers/getPayrollStatys.js";
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

export async function getContracts(month?: string) {
  if (month && !isValidMonth(month)) {
    throw new AppError(
      "Invalid month format. Expected format is YYYY-MM.",
      400,
    );
  }
  // "missing" only means something for a single month, so default to the current one
  const contracts = await adminModel.getContracts(
    month ?? format(new Date(), "yyyy-MM"),
  );

  return contracts;
}

export async function getStudentContracts(userId: string) {
  const [student] = await adminModel.getStudentsByIds([userId]);

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  return userModel.getMyContracts(userId);
}

export async function getContract(
  contractId: string,
  download: boolean = false,
) {
  if (!contractId) {
    throw new AppError("Contract ID is required", 400);
  }

  const contract = await adminModel.getContract(contractId);

  if (!contract) {
    throw new AppError("Contract not found", 404);
  }

  const contractFileName = `contract-${contract.user_first_name + contract.user_last_name}-${contract.contract_month}.pdf`;

  const contractUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: contract.s3_key,
      ResponseContentType: "application/pdf",
      ResponseContentDisposition: download
        ? `attachment; filename="${contractFileName}"`
        : "inline",
    }),
    {
      expiresIn: SIGNED_URL_EXPIRES_IN, // URL expires in 1 hour
    },
  );

  const contractWithUrl = {
    ...contract,
    signed_url: contractUrl,
  };

  return contractWithUrl;
}

export async function sendContractReminder(
  adminId: string,
  month: string,
  studentIds?: string[],
): Promise<ContractReminderResult> {
  if (!month) {
    throw new AppError("Month is required", 400);
  }
  if (!adminId) {
    throw new AppError("Admin ID is required", 400);
  }

  if (!isValidMonth(month)) {
    throw new AppError(
      "Invalid month format. Expected format is YYYY-MM.",
      400,
    );
  }

  const requestedIds = studentIds ? [...new Set(studentIds.map(String))] : null;

  if (requestedIds) {
    if (requestedIds.length === 0) {
      throw new AppError("studentIds must not be empty", 400);
    }
    if (!requestedIds.every((id) => !isNaN(Number(id)))) {
      throw new AppError("Student IDs must be numeric", 400);
    }
  }

  const students = requestedIds
    ? await adminModel.getStudentsByIds(requestedIds)
    : await adminModel.getStudentsMissingContract(month);

  const foundIds = new Set(students.map((student) => String(student.id)));

  const result: ContractReminderResult = {
    sent: [],
    // only meaningful when specific ids were requested
    notFound: requestedIds
      ? requestedIds.filter((id) => !foundIds.has(id))
      : [],
    noEmail: [],
    failed: [],
  };

  await Promise.all(
    students.map(async (student) => {
      const studentId = String(student.id);

      if (!student.email) {
        result.noEmail.push(studentId);
        return;
      }

      // catch per student so one failed email doesn't reject the whole batch
      try {
        await emailService.sendContractReminderEmail(
          student.email,
          month,
          student.first_name,
        );
        await adminModel.insertContractReminder(adminId, studentId, month);
        result.sent.push(studentId);
      } catch (err) {
        console.error(`Contract reminder failed for student ${studentId}`, err);
        result.failed.push(studentId);
      }
    }),
  );

  return result;
}

export async function getPayroll(month?: string): Promise<Payroll> {
  if (month && !isValidMonth(month)) {
    throw new AppError(
      "Invalid month format. Expected format is YYYY-MM.",
      400,
    );
  }

  const selectedMonth = month ?? format(new Date(), "yyyy-MM");

  const [rows, scheduled, budget] = await Promise.all([
    adminModel.getPayrollRows(selectedMonth),
    adminModel.getScheduledPayroll(selectedMonth),
    adminModel.getPayrollBudget(selectedMonth),
  ]);

  const payroll: Payroll = {
    month: selectedMonth,
    status: getPayrollStatus(selectedMonth, rows),
    rows,
    scheduled,
    budget,
  };

  return payroll;
}

export async function setPayrollBudget(
  month: string,
  amount: number,
): Promise<void> {
  if (!isValidMonth(month)) {
    throw new AppError(
      "Invalid month format. Expected format is YYYY-MM.",
      400,
    );
  }
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    throw new AppError("Budget must be a number", 400);
  }
  if (amount <= 0) {
    throw new AppError("Amount must be larger than zero", 400);
  }

  await adminModel.setPayrollBudget(month, amount);
}

function assertMonthCanBePaid(month: string, paidByAdminId: string): void {
  if (!isValidMonth(month)) {
    throw new AppError("Invalid month format, use YYYY-mm", 400);
  }

  if (!paidByAdminId) {
    throw new AppError("Admin id is required", 400);
  }

  // same rule as the "in_progress" status: paying mid-month would store
  // partial amounts, and those payments can't be overwritten afterwards
  if (month >= format(new Date(), "yyyy-MM")) {
    throw new AppError("This month hasn't ended yet", 409);
  }
}

export async function markPayrollPaid(
  month: string,
  paidByAdminId: string,
): Promise<void> {
  assertMonthCanBePaid(month, paidByAdminId);

  const markedCount = await adminModel.markPayrollPaid(month, paidByAdminId);

  // only workers with worked hours and a contract for the month get paid,
  // so nothing inserted means there was nobody left to pay
  if (markedCount === 0) {
    throw new AppError("No unpaid workers with a contract for this month", 409);
  }
}

export async function markStudentPaid(
  month: string,
  userId: number,
  paidByAdminId: string,
): Promise<void> {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new AppError("Invalid student id", 400);
  }

  assertMonthCanBePaid(month, paidByAdminId);

  const markedCount = await adminModel.markPayrollPaid(
    month,
    paidByAdminId,
    userId,
  );

  // nothing inserted: no hours, no contract for the month or already paid
  if (markedCount === 0) {
    throw new AppError(
      "This student has no contract for this month or is already paid",
      409,
    );
  }
}

export async function unmarkPayrollPaid(month: string): Promise<void> {
  if (!isValidMonth(month)) {
    throw new AppError("Invalid month format, use YYYY-mm", 400);
  }

  const unmarkedCount = await adminModel.unmarkPayrollPaid(month);

  if (unmarkedCount === 0) {
    throw new AppError("Nobody is marked as paid for this month", 409);
  }
}

export async function unmarkStudentPaid(
  month: string,
  userId: number,
): Promise<void> {
  if (!isValidMonth(month)) {
    throw new AppError("Invalid month format, use YYYY-mm", 400);
  }

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new AppError("Invalid student id", 400);
  }

  const unmarkedCount = await adminModel.unmarkPayrollPaid(month, userId);

  if (unmarkedCount === 0) {
    throw new AppError("This student isn't marked as paid for this month", 409);
  }
}
