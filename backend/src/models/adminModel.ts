import pool from "../db/db.js";
import {
  AdminContractRow,
  Contract,
  ContractMetadata,
  ContractWithUrl,
} from "../types/contract.js";
import { monthlyTotals } from "../types/monthlyTotals.js";
import { recentStudent } from "../types/recentStudent.js";
import { deletableStudent } from "../types/Student.js";

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

// must_change_password stays true until the student sets their own password,
// either through the emailed setup link or by changing the temporary one
export async function getRecentStudents(
  limit: number,
): Promise<recentStudent[]> {
  const result = await pool.query<recentStudent>(
    `SELECT u.id, u.first_name, u.last_name, u.email, u.created_at,
       CASE
         WHEN NOT u.is_active THEN 'deactivated'
         WHEN u.must_change_password THEN 'not_signed_in'
         WHEN EXISTS (SELECT 1 FROM shift_requests sr WHERE sr.user_id = u.id)
           OR EXISTS (SELECT 1 FROM shift_assignments sa WHERE sa.user_id = u.id)
           THEN 'active'
         ELSE 'no_requests'
       END AS onboarding_status
     FROM users u
     WHERE u.user_role = 'student'
     ORDER BY u.created_at DESC, u.id DESC
     LIMIT $1`,
    [limit],
  );

  return result.rows;
}

export async function getDeletableStudents(): Promise<deletableStudent[]> {
  const result = await pool.query<deletableStudent>(
    `SELECT u.id, u.first_name, u.last_name, u.email, u.created_at FROM users u WHERE u.user_role = 'student' AND NOT EXISTS (SELECT 1 FROM shift_requests sr WHERE sr.user_id = u.id) AND NOT EXISTS (SELECT 1 FROM shift_assignments sa WHERE sa.user_id = u.id) ORDER BY u.created_at DESC, u.id DESC`,
  );

  return result.rows;
}

export async function deleteStudent(id: number): Promise<void> {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 AND user_role = 'student'`,
    [id],
  );
}

export async function getContracts(month: string): Promise<AdminContractRow[]> {
  // month filter lives in the ON clause so students without a contract keep their row (c.* = null)
  const result = await pool.query<AdminContractRow>(
    `SELECT
  u.id AS user_id,
  u.first_name AS user_first_name,
  u.last_name AS user_last_name,
  u.email AS user_email,
  $1::text AS contract_month,
  c.id AS contract_id,
  c.created_at AS uploaded_at,
  c.file_name,
  c.file_size
    FROM users u
    LEFT JOIN contracts c
      ON c.user_id = u.id
      AND c.contract_month = ($1::text || '-01')::date
      WHERE u.user_role = 'student'
      AND (
        c.id IS NOT NULL
        OR (
          u.is_active
          AND u.created_at < ($1::text || '-01')::date + interval '1 month'
    )
  )
    ORDER BY (c.id IS NOT NULL), u.last_name, u.first_name`,
    [month],
  );

  return result.rows;
}

export async function getContract(contractId: string): Promise<Contract> {
  const result = await pool.query<Contract>(
    `SELECT 
  c.id,
  c.user_id,
  c.file_key as s3_key,
  to_char(c.contract_month, 'YYYY-MM') as contract_month, 
  c.created_at AS uploaded_at, 
  u.first_name AS user_first_name,
   u.last_name AS user_last_name, 
   u.id AS user_id,
   c.file_name, 
   c.file_size
     FROM contracts c
     JOIN users u ON c.user_id = u.id
     WHERE c.id = $1`,
    [contractId],
  );

  return result.rows[0];
}
