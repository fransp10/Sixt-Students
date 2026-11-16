import argon2 from "argon2";
import { createHash, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import AppError from "../errors/AppError.js";
import * as authModel from "../models/authModel.js";
import { isPasswordRequirementsMet } from "../helpers/isPasswordRequirementsMet.js";
import { authUserReturn } from "../types/User.js";
export async function authenticateUser(
  username: string,
  password: string,
): Promise<{
  user: authUserReturn;
  accessToken: string;
  refreshToken: string;
}> {
  if (!username || !password) {
    throw new AppError("Username and password are required", 400);
  }

  const user = await authModel.getUserByUsername(username);

  if (!user) {
    throw new AppError("Invalid username or password", 401);
  }

  const isPasswordValid = await argon2.verify(user.password_hash, password);

  if (!isPasswordValid) {
    throw new AppError("Invalid username or password", 401);
  }

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRATION) * 60 },
  );

  const { refreshToken, refreshTokenHash } = generateRefreshToken();

  await authModel.insertRefreshToken(user.id, refreshTokenHash);

  const userToReturn = {
    id: user.id,
    username: user.username,
    user_role: user.user_role,
    is_active: user.is_active,
    first_name: user.first_name,
    last_name: user.last_name,
    date_of_birth: user.date_of_birth,
  };

  return { user: userToReturn, accessToken, refreshToken };
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<{ message: string }> {
  if (!token) {
    throw new AppError("Token is required", 400);
  }

  if (typeof token !== "string") {
    throw new AppError("Token must be a string", 400);
  }

  if (!newPassword) {
    throw new AppError("New password is required", 400);
  }
  if (typeof newPassword !== "string") {
    throw new AppError("New password must be a string", 400);
  }

  const trimmedNewPassword = newPassword.trim();
  const { isRequirementsMet } = isPasswordRequirementsMet(
    trimmedNewPassword,
    "reset",
  );

  if (!isRequirementsMet) {
    throw new AppError("Password does not meet requirements", 400);
  }
  const tokenHash = hashToken(token);
  const passwordHash = await argon2.hash(trimmedNewPassword);

  const isOk = await authModel.resetUserPassword(tokenHash, passwordHash);

  if (!isOk) {
    throw new AppError("Invalid or expired token", 400);
  }

  return { message: "Password reset successful" };
}

export async function validateResetToken(
  token: string,
): Promise<{ ok: boolean; message: string }> {
  if (!token) {
    throw new AppError("Token is required", 400);
  }

  if (typeof token !== "string") {
    throw new AppError("Token must be a string", 400);
  }

  const tokenHash = hashToken(token);
  const isValid = await authModel.validateResetToken(tokenHash);

  if (!isValid) {
    return { ok: false, message: "Invalid or expired token" };
  }

  return { ok: true, message: "Token is valid" };
}

export function generateRefreshToken(): {
  refreshToken: string;
  refreshTokenHash: string;
} {
  const refreshToken = randomBytes(64).toString("hex");

  const refreshTokenHash = hashToken(refreshToken);

  return { refreshToken, refreshTokenHash };
}

export function hashToken(refreshToken: string): string {
  const refreshTokenHash = createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  return refreshTokenHash;
}
