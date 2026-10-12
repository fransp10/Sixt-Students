import { Request, Response } from "express";
import * as authServices from "../services/authServices.js";

export async function loginUser(
  req: Request<{}, unknown, { username: string; password: string }>,
  res: Response,
) {
  const { username, password } = req.body;

  const { accessToken, user } = await authServices.authenticateUser(
    username,
    password,
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: Number(process.env.ACCESS_TOKEN_EXPIRATION) * 60 * 1000, // 15 minute
  });

  res.status(200).json({ message: "Login successful", user });
}

export function logoutUser(req: Request, res: Response) {
  res.clearCookie("accessToken");

  res.status(200).json({ message: "Logout successful" });
}

export async function resetPassword(
  req: Request<{}, unknown, { token: string; newPassword: string }>,
  res: Response,
): Promise<void> {
  const { token, newPassword } = req.body;

  const message = await authServices.resetPassword(token, newPassword);

  res.status(200).json(message);
}

export async function validateResetToken(
  req: Request<{}, unknown, { token: string }>,
  res: Response,
): Promise<void> {
  const { token } = req.body;

  const message = await authServices.validateResetToken(token);

  res.status(200).json(message);
}
