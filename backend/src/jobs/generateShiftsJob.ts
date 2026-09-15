import cron from "node-cron";
import * as shiftServices from "../services/shiftsServices.js";
export function startGenerateShiftsJob() {
  // Schedule the job to run every day at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("Generating upcoming shifts...");

    try {
      await shiftServices.generateShiftsForDateRange();
    } catch (error) {
      console.error("Error generating upcoming shifts:", error);
    }
  });
}
