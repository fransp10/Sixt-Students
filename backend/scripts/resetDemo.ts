// Resets the demo environment: wipes the data, seeds it again, and uploads a contract PDF
// to S3 for every seeded contract.
// Usage: npm run demo:reset
//
// !! DESTRUCTIVE !! It only runs when DEMO_MODE=true, which must be set ONLY on the demo
// environment (its own database and its own S3 bucket).
import "dotenv/config";
import resetDemo from "../src/services/demoResetService.js";
import pool from "../src/db/db.js";

try {
  await resetDemo();
} finally {
  pool.end().catch((error) => {
    console.error("Error closing database pool:", error);
    process.exitCode = 1;
  });
}
