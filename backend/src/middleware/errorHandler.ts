import { NextFunction, Request, Response } from "express";

export default function ErrorHandler(
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);

  const statusCode = err.statusCode || 500;

  const message = err.statusCode ? err.message : "Internal Server Error";

  return res.status(statusCode).json({ error: message });
}
