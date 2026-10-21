import pool from "../db/db.js";
import { monthlyTotals } from "../types/monthlyTotals.js";

export async function getActiveStudentsCount(): Promise<number> {
  const numOfStudents = await pool.query(
    "SELECT COUNT(*)::int AS count FROM users WHERE is_active = 'true' AND user_role = 'student'",
  );
  return numOfStudents.rows[0].count;
}

export async function getShiftRequestsCount(): Promise<number> {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS count
     FROM shift_requests sr
     JOIN shifts s ON sr.shift_id = s.id
     WHERE s.date + s.scheduled_start_time > LOCALTIMESTAMP
       AND NOT EXISTS (SELECT 1 FROM shift_assignments sa
                       WHERE sa.shift_id = sr.shift_id AND sa.user_id = sr.user_id)`,
  );
  return result.rows[0].count;
}

export async function getTotalPayroll(): Promise<number> {
  const result = await pool.query(
    `SELECT COALESCE(SUM(hours * hourly_rate), 0)::float AS total
     FROM worked_shifts
     WHERE date >= date_trunc('month', CURRENT_DATE) AND date < CURRENT_DATE`,
  );
  return result.rows[0].total;
}

export async function getMonthlyTotals(
  months: number,
): Promise<monthlyTotals[]> {
  const result = await pool.query(
    `SELECT to_char(date, 'YYYY-MM') AS month,
       SUM(hours)::float AS hours,
       SUM(hours * hourly_rate)::float AS payroll
FROM worked_shifts
WHERE date >= date_trunc('month', CURRENT_DATE) - ($1 - 1) * interval '1 month'
  AND date < CURRENT_DATE
GROUP BY 1
ORDER BY 1`,
    [months],
  );

  return result.rows;
}
