import AppError from "../errors/AppError.js";
import { getUserById } from "../models/userModel.js";
import * as shiftModel from "../models/shiftModel.js";
import * as userModel from "../models/userModel.js";
import { isValidEmail } from "../helpers/isValidEmail.js";
import { isValidPhone } from "../helpers/isValidPhone.js";
import argon2 from "argon2";
import { isValidMonth } from "../helpers/isValidMonth.js";
import { SIGNED_URL_EXPIRES_IN } from "../helpers/constants.js";
import { getAppSettings } from "../models/appSettingsModel.js";
import { isPasswordRequirementsMet } from "../helpers/isPasswordRequirementsMet.js";
import { randomUUID } from "crypto";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "../config/s3.js";
import {
  Contract,
  ContractMetadata,
  ContractWithUrl,
} from "../types/contract.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { normalizeNameWithWeirdChars } from "../helpers/normalizeWeirdNames.js";
export async function checkMe(userId: string) {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}

export async function requestShift(userId: string, shiftId: string) {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }
  const shift = await shiftModel.getShiftById(shiftId);

  if (!shift) {
    throw new AppError("Shift not found", 404);
  }

  const newShiftRequest = await shiftModel.createShiftRequest(
    userId,
    shiftId,
    user.default_hourly_rate,
  );

  return newShiftRequest;
}

export async function getShiftAssignmentsByIdBetweenDates(
  userId: string,
  startDate?: string,
  endDate?: string,
) {
  const shiftAssignments = await shiftModel.getShiftAssignmentsByIdBetweenDates(
    userId,
    startDate,
    endDate,
  );
  return shiftAssignments;
}

// email and phone come straight from the request body, so they can be any type
export async function updateUserInfo(
  userId: string,
  email?: unknown,
  phone?: unknown,
) {
  if (email === undefined && phone === undefined) {
    throw new AppError("Provide an email or phone to update", 400);
  }
  if (email !== undefined && typeof email !== "string") {
    throw new AppError("Email must be a string", 400);
  }
  if (phone !== undefined && typeof phone !== "string") {
    throw new AppError("Phone must be a string", 400);
  }

  const fieldsToUpdate: { email?: string; phone?: string } = {};

  if (email !== undefined) {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail.length > 254) {
      throw new AppError("Email is too long", 400);
    }
    if (!isValidEmail(normalizedEmail)) {
      throw new AppError("Invalid email format", 400);
    }
    fieldsToUpdate.email = normalizedEmail;
  }

  if (phone !== undefined) {
    const normalizedPhone = phone.trim();
    if (!isValidPhone(normalizedPhone)) {
      throw new AppError("Invalid phone format", 400);
    }
    fieldsToUpdate.phone = normalizedPhone;
  }

  if (!userId) {
    throw new AppError("UserId is required", 400);
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new AppError(`User with ID ${userId} not found`, 404);
  }

  if (user.email === fieldsToUpdate.email) {
    throw new AppError("New email is the same as the current email", 400);
  }

  if (user.phone === fieldsToUpdate.phone) {
    throw new AppError("New phone is the same as the current phone", 400);
  }

  try {
    return await userModel.updateUser(userId, fieldsToUpdate);
  } catch (err) {
    if ((err as { code?: string }).code === "23505")
      throw new AppError("Email is already in use", 409);
    throw err;
  }
}

export async function updateMyPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  if (!currentPassword) {
    throw new AppError("Current password is required", 400);
  }

  if (!newPassword) {
    throw new AppError("New password is required", 400);
  }
  if (!userId) {
    throw new AppError("UserId is required", 400);
  }

  const trimedCurrentPassword = currentPassword.trim();
  const trimedNewPassword = newPassword.trim();

  const { isRequirementsMet } = isPasswordRequirementsMet(
    trimedNewPassword,
    "update",
    trimedCurrentPassword,
  );

  if (!isRequirementsMet) {
    throw new AppError("New password does not meet the requirements", 400);
  }

  const passwordHash = await userModel.getPasswordHashById(userId);

  if (!passwordHash) {
    throw new AppError("User not found", 404);
  }

  const isCurrentPasswordCorrect = await argon2.verify(
    passwordHash,
    trimedCurrentPassword,
  );

  if (!isCurrentPasswordCorrect) {
    throw new AppError("Current password is incorrect", 401);
  }

  const newPasswordHash = await argon2.hash(trimedNewPassword);

  const updatedUser = await userModel.updatePassword(userId, newPasswordHash);

  return updatedUser;
}

export async function getStatsByUserId(
  userId: string,
  startDate?: string,
  endDate?: string,
) {
  if (!userId) {
    throw new AppError("UserId is required", 400);
  }

  const stats = await userModel.getStatsForUser(userId, startDate, endDate);

  return stats;
}

export async function getRaceStats(month?: string) {
  if (month && !isValidMonth(month)) {
    throw new AppError("Invalid month format. Expected format: YYYY-MM", 400);
  }

  const earningsStats = await userModel.getRaceStats(month);

  return earningsStats;
}

export async function getMyGoal(userId: string, month: string) {
  if (!userId) {
    throw new AppError("UserId is required", 400);
  }

  if (!month) {
    throw new AppError("Month is required", 400);
  }

  if (!isValidMonth(month)) {
    throw new AppError("Invalid month format. Expected format: YYYY-MM", 400);
  }

  const goal = await userModel.getMyGoal(userId, month);

  if (!goal) {
    const { new_student_monthly_goal } = await getAppSettings();
    return { amount: new_student_monthly_goal };
  }

  return goal;
}

export async function updateMyGoal(userId: string, amount: number) {
  if (!userId) {
    throw new AppError("UserId is required", 400);
  }

  if (!amount) {
    throw new AppError("Amount is required", 400);
  }

  if (typeof amount !== "number" || isNaN(amount)) {
    throw new AppError("Amount must be a valid number", 400);
  }

  if (amount < 0) {
    throw new AppError("Amount must be a non-negative number", 400);
  }

  const updatedGoal = await userModel.updateMyGoal(userId, amount);

  return updatedGoal;
}

export async function uploadContract(
  userId: string,
  month: string,
  file: Express.Multer.File | undefined,
): Promise<void> {
  if (!userId) {
    throw new AppError("UserId is required", 400);
  }

  if (!month) {
    throw new AppError("Month is required", 400);
  }

  if (!isValidMonth(month)) {
    throw new AppError("Invalid month format. Expected format: YYYY-MM", 400);
  }

  if (!file) {
    throw new AppError("No file uploaded", 400);
  }

  const fileKey = `contracts/${userId}/${month}.pdf`;

  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: fileKey,
      Body: file.buffer,
      ContentType: "application/pdf",
    }),
  );
  await userModel.saveUploadContractToDb(
    userId,
    month,
    fileKey,
    file.originalname,
    file.size,
  );
}

export async function getMyContract(
  userId: string,
  month: string,
  download: boolean = false,
): Promise<ContractWithUrl> {
  if (!userId) {
    throw new AppError("UserId is required", 400);
  }
  if (!month) {
    throw new AppError("Month is required", 400);
  }

  if (month && !isValidMonth(month)) {
    throw new AppError("Invalid month format. Expected format: YYYY-MM", 400);
  }

  const contract = await userModel.getMyContract(userId, month);

  if (!contract) {
    throw new AppError("Contract not found", 404);
  }

  const { s3_key } = contract;

  const username = normalizeNameWithWeirdChars(
    contract.user_first_name.toLowerCase() +
      "-" +
      contract.user_last_name.toLowerCase(),
  );

  const signedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3_key,
      ResponseContentType: "application/pdf",
      ResponseContentDisposition: download
        ? `attachment; filename="contract-${username}-${month}.pdf"`
        : "inline",
    }),
    { expiresIn: SIGNED_URL_EXPIRES_IN },
  );

  const contractWithUrl: ContractWithUrl = {
    contract_month: contract.contract_month,
    id: contract.id,
    signed_url: signedUrl,
    user_id: contract.user_id,
    uploaded_at: contract.uploaded_at,
    file_name: contract.file_name,
    file_size: contract.file_size,
    user_first_name: contract.user_first_name,
    user_last_name: contract.user_last_name,
  };

  return contractWithUrl;
}

export async function getMyContracts(
  userId: string,
): Promise<ContractMetadata[]> {
  if (!userId) {
    throw new AppError("UserId is required", 400);
  }

  return userModel.getMyContracts(userId);
}

export async function deleteContract(
  userId: string,
  contractId: string,
): Promise<void> {
  if (!userId) {
    throw new AppError("UserId is required", 400);
  }

  if (!contractId) {
    throw new AppError("ContractId is required", 400);
  }

  const deleted = await userModel.deleteContractById(contractId, userId);

  if (!deleted) {
    throw new AppError("Contract not found", 404);
  }
  await s3.send(
    new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: deleted.file_key }),
  );
}
