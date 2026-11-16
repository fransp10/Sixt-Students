import "dotenv/config";
import express from "express";
import ErrorHandler from "./middleware/errorHandler.js";
import userRouter from "./routes/usersRoutes.js";
import shiftsRouter from "./routes/shiftsRoutes.js";
import { startGenerateShiftsJob } from "./jobs/generateShiftsJob.js";
import * as shiftServices from "./services/shiftsServices.js";
import { authRouter } from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { authenticate } from "./middleware/authenticate.js";
import { requireAdmin } from "./middleware/requireAdmin.js";
import { meRouter } from "./routes/meRoutes.js";
import cors from "cors";
import { adminRouter } from "./routes/adminRoutes.js";
import { generalLimiter } from "./middleware/rateLimiters.js";
const app = express();

if (process.env.TRUST_PROXY) {
  app.set("trust proxy", Number(process.env.TRUST_PROXY));
}

// generate upcoming shifts on server start
await shiftServices.generateShiftsForDateRange();
// start the cron job to generate upcoming shifts every day at midnight
startGenerateShiftsJob();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api", generalLimiter); // Apply the generalLimiter to all routes under /api
app.use("/api/auth", authRouter);

app.use(authenticate); // Apply the authenticate middleware to all routes below this line
app.use("/api/users", requireAdmin, userRouter);
app.use("/api/shifts", shiftsRouter);
app.use("/api/me", meRouter);
app.use("/api/admin", requireAdmin, adminRouter);

// Error handling middleware
// should be placed after all other routes and middleware
app.use(ErrorHandler);
app.use((req, res) => {
  res
    .status(404)
    .json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});
