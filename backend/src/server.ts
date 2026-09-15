import express, { type Request, type Response } from "express";
import "dotenv/config";
import ErrorHandler from "./middleware/errorHandler.js";
import userRouter from "./routes/usersRoutes.js";
import shiftsRouter from "./routes/shiftsRoutes.js";
import { startGenerateShiftsJob } from "./jobs/generateShiftsJob.js";
import * as shiftServices from "./services/shiftsServices.js";
const app = express();

// generate upcoming shifts on server start
await shiftServices.generateShiftsForDateRange();
// start the cron job to generate upcoming shifts every day at midnight
startGenerateShiftsJob();

app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/users", userRouter);
app.use("/api/shifts", shiftsRouter);
// Error handling middleware
// should be placed after all other routes and middleware
app.use(ErrorHandler);
