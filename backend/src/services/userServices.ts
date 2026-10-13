import crypto from "crypto";
import argon2 from "argon2";
import { DatabaseError } from "pg";
import * as userModel from "../models/userModel.js";

import AppError from "../errors/AppError.js";
import {
  CreateUserReqBodyType,
  UserRoles,
  UserWithoutPassword,
  UserWithPassword,
} from "../types/User.js";
import { UserStats } from "../types/Shift.js";
import { isValid } from "date-fns";
import { sendPasswordResetEmail } from "./emailServices.js";
import { isValidEmail } from "../helpers/isValidEmail.js";

export async function createUser(
  data: CreateUserReqBodyType,
): Promise<UserWithPassword> {
  try {
    const password = crypto.randomBytes(12).toString("base64url");
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });
    const user = await userModel.createUser({
      ...data,
      password_hash: passwordHash,
    });

    return { ...user, password };
  } catch (error) {
    if (
      error instanceof DatabaseError &&
      error.code === "23505" &&
      error.constraint === "users_username_unique"
    ) {
      throw new AppError("Username already exists", 409);
    }
    throw error;
  }
}

export async function getShiftAssignmentsByUserId(
  userId: string,
  startDate?: string,
  endDate?: string,
  period?: "upcoming" | "past",
): Promise<any[]> {
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    throw new AppError("Start date cannot be after end date", 400);
  }

  if (startDate && !isValid(new Date(startDate))) {
    throw new AppError("Invalid start date value ", 400);
  }

  if (endDate && !isValid(new Date(endDate))) {
    throw new AppError("Invalid end date value ", 400);
  }

  if (period && period !== "upcoming" && period !== "past") {
    throw new AppError("Invalid period requested", 400);
  }

  const shiftAssignments = await userModel.getShiftAssignmentsByUserId(
    userId,
    startDate,
    endDate,
    period,
  );

  if (!shiftAssignments) {
    throw new AppError("Shift assignments not found for the user", 404);
  }
  return shiftAssignments;
}

export async function getUsers(
  role?: UserRoles,
): Promise<UserWithoutPassword[]> {
  if (role !== "admin" && role !== "student" && role !== undefined) {
    throw new AppError("Invalid role requested", 400);
  }

  return await userModel.getUsers(role);
}

export async function getStatsForUser(
  userId: string,
  startDate: string,
  endDate: string,
): Promise<UserStats> {
  const stats = await userModel.getStatsForUser(userId, startDate, endDate);

  return stats;
}

export async function sendPasswordResetLink(
  userId: string,
  email: string,
): Promise<void> {
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!email) {
    throw new AppError("Email is required", 400);
  }


  if (!isValidEmail(email)) {
    throw new AppError("Invalid email format", 400);
  }

  const user = await userModel.getUserById(userId);

  if (!user) {
    throw new AppError(`User with id ${userId} not found`, 404);
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  await userModel.storePasswordResetToken(userId, resetTokenHash);

  const link = new URL("/reset-password", process.env.FRONTEND_URL);
  link.searchParams.set("token", resetToken);

  await sendPasswordResetEmail(email, link.toString());
}
