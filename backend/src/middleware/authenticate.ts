import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getUserById } from "../models/userModel.js";
import AppError from "../errors/AppError.js";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    throw new AppError("Access token is missing", 401);
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!);
  } catch {
    throw new AppError("Invalid access token", 401);
  }

  if (
    typeof decodedToken === "string" ||
    typeof decodedToken.userId !== "number"
  ) {
    throw new AppError("Invalid access token", 401);
  }

  const user = await getUserById(decodedToken.userId.toString());
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (user.is_active === false) {
    throw new AppError("User is inactive", 403);
  }

  req.user = {
    id: user.id.toString(),
    role: user.user_role,
  };
  next();
}
