import pool from "../db/db.js";
import { AppSettings } from "../types/appSettings.js";

export async function getAppSettings(): Promise<AppSettings> {
  const result = await pool.query(
    `SELECT new_student_hourly_rate::float, new_student_monthly_goal::float
     FROM app_settings`,
  );
  return result.rows[0];
}

export async function updateAppSettings(
  hourlyRate: number | null,
  monthlyGoal: number | null,
): Promise<AppSettings> {
  const result = await pool.query(
    `UPDATE app_settings
     SET new_student_hourly_rate = COALESCE($1, new_student_hourly_rate),
         new_student_monthly_goal = COALESCE($2, new_student_monthly_goal)
     RETURNING new_student_hourly_rate::float, new_student_monthly_goal::float`,
    [hourlyRate, monthlyGoal],
  );
  return result.rows[0];
}
