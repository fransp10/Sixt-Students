import crypto from "crypto";
import argon2 from "argon2";
import * as userModel from "../models/userModel.js";

import AppError from "../errors/AppError.js";
import {
  CreatedUser,
  CreateUserModel,
  CreateUserReqBodyType,
  SigninOption,
  UserRoles,
  UserWithoutPassword,
} from "../types/User.js";
import { UserStats } from "../types/Shift.js";
import { differenceInYears, isValid, parse } from "date-fns";
import { sendPasswordResetEmail } from "./emailServices.js";
import { isValidEmail } from "../helpers/isValidEmail.js";
import { isValidPhone } from "../helpers/isValidPhone.js";
import { isUniqueViolation } from "../helpers/isUniqueViolation.js";
import {
  DEFAULT_HOURLY_RATE,
  MAX_HOURLY_RATE,
  MINIMUM_STUDENT_AGE,
} from "../helpers/constants.js";
import { generateBaseUsername } from "../helpers/generateUsername.js";

const SIGNIN_OPTIONS: SigninOption[] = ["email", "tempPassword"];
const USER_ROLES: UserRoles[] = ["admin", "student"];
const MAX_BASE_USERNAME_LENGTH = 50; // leaves room for a number suffix in varchar(55)
const MAX_USERNAME_ATTEMPTS = 10;

type ValidatedCreateUserInput = Omit<
  CreateUserModel,
  "username" | "password_hash"
> & {
  signin_option: SigninOption;
};

function requireString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new AppError(`${fieldName} is required`, 400);
  }
  return value.trim();
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function validateCreateUserInput(
  data: CreateUserReqBodyType,
): ValidatedCreateUserInput {
  const { signin_option, user_role } = data;

  if (!SIGNIN_OPTIONS.includes(signin_option)) {
    throw new AppError("Invalid sign-in option", 400);
  }
  if (!USER_ROLES.includes(user_role)) {
    throw new AppError("Invalid user role", 400);
  }

  const first_name = requireString(data.first_name, "First name");
  const last_name = requireString(data.last_name, "Last name");

  const email = optionalString(data.email)?.toLowerCase() ?? null;
  if (!email && signin_option === "email") {
    throw new AppError("Email is required for the email sign-in option", 400);
  }
  if (email && !isValidEmail(email)) {
    throw new AppError("Invalid email format", 400);
  }

  const phone = optionalString(data.phone);
  if (phone && !isValidPhone(phone)) {
    throw new AppError("Invalid phone number", 400);
  }

  const date_of_birth = requireString(data.date_of_birth, "Date of birth");
  const dob = parse(date_of_birth, "yyyy-MM-dd", new Date());
  if (!isValid(dob) || dob > new Date()) {
    throw new AppError("Invalid date of birth", 400);
  }
  if (
    user_role === "student" &&
    differenceInYears(new Date(), dob) < MINIMUM_STUDENT_AGE
  ) {
    throw new AppError(
      `Student must be at least ${MINIMUM_STUDENT_AGE} years old`,
      400,
    );
  }

  // Admins don't have an hourly rate, so they get the column default
  let default_hourly_rate = DEFAULT_HOURLY_RATE;
  if (user_role === "student") {
    const rate = data.default_hourly_rate;
    if (typeof rate !== "number" || !Number.isFinite(rate)) {
      throw new AppError("Default hourly rate must be a number", 400);
    }
    if (rate <= 0 || rate > MAX_HOURLY_RATE) {
      throw new AppError(
        `Default hourly rate must be between 0 and ${MAX_HOURLY_RATE}`,
        400,
      );
    }
    default_hourly_rate = rate;
  }

  return {
    signin_option,
    user_role,
    first_name,
    last_name,
    email,
    phone,
    date_of_birth,
    default_hourly_rate,
  };
}

// Relies on the unique constraint instead of checking with a SELECT first:
// two admins creating the same name at the same time would both pass a SELECT check
async function insertUserWithUniqueUsername(
  baseUsername: string,
  data: Omit<CreateUserModel, "username">,
): Promise<UserWithoutPassword> {
  for (let attempt = 1; attempt <= MAX_USERNAME_ATTEMPTS; attempt++) {
    const next = await userModel.getNextUsernameNumber(baseUsername);
    const username = next === 1 ? baseUsername : `${baseUsername}${next}`;

    try {
      return await userModel.createUser({ ...data, username });
    } catch (error) {
      if (isUniqueViolation(error, "users_username_unique")) continue;
      if (isUniqueViolation(error, "users_email_lower_unique")) {
        throw new AppError("Email already in use", 409);
      }
      throw error;
    }
  }

  throw new AppError("Could not generate a unique username", 500);
}

export async function createUser(
  data: CreateUserReqBodyType,
): Promise<CreatedUser> {
  const { signin_option, ...userData } = validateCreateUserInput(data);
  const userName = generateBaseUsername(
    userData.first_name,
    userData.last_name,
  ).slice(0, MAX_BASE_USERNAME_LENGTH);

  if (!userName) {
    throw new AppError("Name must contain at least one letter or number", 400);
  }

  const password = crypto.randomBytes(12).toString("base64url");
  const password_hash = await argon2.hash(password, { type: argon2.argon2id });

  const user = await insertUserWithUniqueUsername(userName, {
    ...userData,
    password_hash,
  });

  if (signin_option === "tempPassword") {
    return { ...user, password };
  }

  // The user already exists here, so a failed email must not fail the request.
  // Otherwise the admin retries and creates a duplicate - they can resend the link
  // with the "Reset password" button instead
  let emailSent = true;
  try {
    await sendPasswordResetLink(String(user.id), userData.email!);
  } catch (error) {
    console.error("Failed to send account setup email:", error);
    emailSent = false;
  }

  return { ...user, emailSent };
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

  await sendPasswordResetEmail(email, link.toString(), user.username);
}
