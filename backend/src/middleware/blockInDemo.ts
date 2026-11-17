import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError.js";

export async function blockInDemo(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (process.env.DEMO_MODE === "true") {
    throw new AppError("This action is not allowed in demo mode", 403);
  }
  next();
}
