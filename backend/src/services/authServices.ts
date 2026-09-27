import argon2 from "argon2";
import jwt from "jsonwebtoken";
import AppError from "../errors/AppError.js";
import * as authModel from "../models/authModel.js";
export async function authenticateUser(
  username: string,
  password: string,
): Promise<string> {
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

  return accessToken;
}
