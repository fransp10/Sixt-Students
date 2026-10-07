import AppError from "../errors/AppError.js";
import { getUserById } from "../models/userModel.js";
import * as shiftModel from "../models/shiftModel.js";
import * as userModel from "../models/userModel.js";
import { isValidEmail } from "../helpers/isValidEmail.js";
import { isValidPhone } from "../helpers/isValidPhone.js";
import argon2 from "argon2";
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

  const requirements = [
    { met: trimedNewPassword.length >= 8 },
    { met: /\d/.test(trimedNewPassword) },
    {
      met:
        trimedNewPassword !== "" && trimedNewPassword !== trimedCurrentPassword,
    },
  ];

  if (!requirements.every((requirement) => requirement.met)) {
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
