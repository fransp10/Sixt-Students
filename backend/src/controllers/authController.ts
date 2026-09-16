import { Request, Response } from "express";
import * as authServices from "../services/authServices.js";

export async function loginUser(
  req: Request<{}, unknown, { username: string; password: string }>,
  res: Response,
) {
  const { username, password } = req.body;

  const accessToken = await authServices.authenticateUser(username, password);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: Number(process.env.ACCESS_TOKEN_EXPIRATION) * 60 * 1000, // 15 minute
  });

  res.status(200).json({ message: "Login successful" });
}

export function logoutUser(req: Request, res: Response) {
  res.clearCookie("accessToken");

  res.status(200).json({ message: "Logout successful" });
}
