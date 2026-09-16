import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError.js";

export function requireStudent(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (!req.user || req.user.role !== "student") {
    throw new AppError("Student privileges required", 403);
  }
  next();
}
