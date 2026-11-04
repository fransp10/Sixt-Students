import { NextFunction, Request, Response } from "express";
import multer from "multer";

export default function ErrorHandler(
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        error: `File too large (max size ${process.env.S3_FILE_SIZE_LIMIT ?? 10} MB)`,
      });
    }
    return res.status(400).json({ error: err.message });
  }

  const statusCode = err.statusCode || 500;

  const message = err.statusCode ? err.message : "Internal Server Error";

  return res.status(statusCode).json({ error: message });
}
