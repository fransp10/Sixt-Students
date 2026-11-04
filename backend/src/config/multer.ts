import multer from "multer";
import AppError from "../errors/AppError.js";

export const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: Number(process.env.S3_FILE_SIZE_LIMIT ?? 10) * 1024 * 1024,
  }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new AppError("Only PDF files are allowed", 400));
    }
    cb(null, true);
  },
});
