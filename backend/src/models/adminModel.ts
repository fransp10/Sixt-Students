import pool from "../db/db.js";

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
