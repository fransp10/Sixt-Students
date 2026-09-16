import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError.js";

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "admin") {
    throw new AppError("Admin privileges required", 403);
  }
  next();
}
