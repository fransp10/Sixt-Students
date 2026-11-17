import cron from "node-cron";
import resetDemo from "../services/demoResetService.js";
export function startDemoResetJob() {
  // Schedule the job to run every day at 3 AM Zagreb time
  cron.schedule(
    "0 3 * * *",
    async () => {
      console.log("Reseting demo data...");

      try {
        await resetDemo();
      } catch (error) {
        console.error("Error reseting the demo:", error);
      }
    },
    { timezone: "Europe/Zagreb" },
  );
}
