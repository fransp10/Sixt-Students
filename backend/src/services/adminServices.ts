import { adminStats } from "../types/adminStats.js";
import * as adminModel from "../models/adminModel.js";
import { monthlyTotals } from "../types/monthlyTotals.js";
import { recentStudent } from "../types/recentStudent.js";
import AppError from "../errors/AppError.js";
import { isValidMonth } from "../helpers/isValidMonth.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { SIGNED_URL_EXPIRES_IN } from "../helpers/constants.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "../config/s3.js";
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
  const contracts = await adminModel.getContracts(month);

  return contracts;
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
