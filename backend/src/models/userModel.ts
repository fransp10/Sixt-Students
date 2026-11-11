import { QueryResult } from "pg";
import pool from "../db/db.js";
import {
  CreateUserModel,
  UserRoles,
  UserWithoutPassword,
} from "../types/User.js";
import { AllowedFields } from "../types/AllowedFields.js";
import { AssignedShiftToUser, Shift, UserStats } from "../types/Shift.js";
import { Contract, ContractMetadata } from "../types/contract.js";

export async function getUsers(
  role?: UserRoles,
): Promise<UserWithoutPassword[]> {
  let query =
    "SELECT id,username,email,phone,user_role,default_hourly_rate,is_active,first_name,last_name,date_of_birth,created_at FROM users";

  if (role) {
    query += ` WHERE user_role = $1`;
  }

  const result: QueryResult<UserWithoutPassword> = await pool.query(
    query,
    role ? [role] : [],
  );
  return result.rows;
}

export async function getPasswordHashById(
  userId: string,
): Promise<string | undefined> {
  const result = await pool.query(
    "SELECT password_hash FROM users WHERE id = $1",
    [userId],
  );
  return result.rows[0]?.password_hash;
}

export async function getNextUsernameNumber(username: string): Promise<number> {
  const escapedUsername = username.replace(".", "\\.");
  const result = await pool.query(
    `SELECT COALESCE(MAX (
      CASE 
      WHEN username = $1 THEN 1
      ELSE substring(username FROM '[0-9]+$')::int
      END
    ),0) + 1 AS next_index
    FROM users
    WHERE username = $1 OR username ~('^' || $2 || '[0-9]+$')
    `,
    [username, escapedUsername],
  );
  return result.rows[0]?.next_index;
}

export async function createUser({
  username,
  email,
  phone,
  user_role,
  default_hourly_rate,
  password_hash,
  date_of_birth,
  first_name,
  last_name,
}: CreateUserModel): Promise<UserWithoutPassword> {
  const result: QueryResult<UserWithoutPassword> = await pool.query(
    `INSERT INTO users (
      username,
      email,
      phone,
      password_hash,
      user_role,
      default_hourly_rate,
      date_of_birth,
      first_name,
      last_name
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING
      id,
      username,
      email,
      phone,
      user_role,
      default_hourly_rate,
      is_active,
      date_of_birth,
      first_name,
      last_name,
      created_at`,
    [
      username,
      email,
      phone,
      password_hash,
      user_role,
      default_hourly_rate,
      date_of_birth,
      first_name,
      last_name,
    ],
  );
  return result.rows[0];
}

export async function getUserById(
  userId: string,
): Promise<UserWithoutPassword | null> {
  const result = await pool.query(
    "SELECT id,username,email,phone,user_role,default_hourly_rate,is_active,date_of_birth,first_name,last_name FROM USERS WHERE id=$1",
    [userId],
  );

  return result.rows[0];
}

export async function updateUser(
  userId: string,
  fieldsToUpdate: Partial<UserWithoutPassword>,
): Promise<UserWithoutPassword> {
  const allowedFields: AllowedFields[] = [
    "email",
    "phone",
    "user_role",
    "default_hourly_rate",
    "first_name",
    "last_name",
    "date_of_birth",
  ];

  const fields = Object.keys(fieldsToUpdate).filter(
    (field): field is AllowedFields =>
      allowedFields.includes(field as AllowedFields),
  );

  const setClause = fields
    .map((field, index) => `${field}=$${index + 1}`)
    .join(",");

  const values = fields.map((field) => fieldsToUpdate[field]);

  const result: QueryResult<UserWithoutPassword> = await pool.query(
    `UPDATE users SET ${setClause} WHERE id=$${fields.length + 1} RETURNING id,username,email,phone,user_role,default_hourly_rate,is_active,first_name,last_name,date_of_birth`,
    [...values, userId],
  );
  return result.rows[0];
}

export async function deactivateUser(
  userId: string,
): Promise<UserWithoutPassword> {
  const result: QueryResult<UserWithoutPassword> = await pool.query(
    "UPDATE users SET is_active = false WHERE id = $1 RETURNING id,username,email,phone,user_role,default_hourly_rate,is_active,first_name,last_name,date_of_birth",
    [userId],
  );

  return result.rows[0];
}

export async function activateUser(
  userId: string,
): Promise<UserWithoutPassword> {
  const result: QueryResult<UserWithoutPassword> = await pool.query(
    "UPDATE users SET is_active = true WHERE id = $1 RETURNING id,username,email,phone,user_role,default_hourly_rate,is_active,first_name,last_name,date_of_birth",
    [userId],
  );

  return result.rows[0];
}

export async function getShiftAssignmentsByUserId(
  userId: string,
  startDate?: string,
  endDate?: string,
  period?: "upcoming" | "past",
): Promise<AssignedShiftToUser[]> {
  let query = `SELECT s.id AS assigned_shift_id,
         s.date,
         st.shift_name AS shift_type,
         s.scheduled_start_time,
         s.scheduled_end_time,
         sa.hourly_rate,
         sa.actual_start_time,
         sa.actual_end_time,
         sa.requested_at,
         sa.no_show,
         ROUND(COALESCE(ws.hours, 0),2)::float AS hours_worked
  FROM shift_assignments sa
  JOIN shifts s       ON sa.shift_id = s.id
  LEFT JOIN worked_shifts ws ON ws.id = sa.id
  JOIN shift_types st ON s.shift_type_id = st.id
  WHERE sa.user_id = $1
`;

  if (period === "upcoming") {
    query += ` AND (s.date + scheduled_end_time + CASE WHEN end_time <= start_time THEN INTERVAL '1 day' ELSE INTERVAL '0' END) >= NOW()`;
  }

  if (period === "past") {
    query += ` AND (s.date + scheduled_end_time + CASE WHEN end_time <= start_time THEN INTERVAL '1 day' ELSE INTERVAL '0' END) < NOW()`;
  }

  const values = [userId];

  if (startDate) {
    values.push(startDate);
    query += ` AND s.date >= $${values.length}`;
  }
  if (endDate) {
    values.push(endDate);
    query += ` AND s.date <= $${values.length}`;
  }

  query += ` ORDER BY s.date DESC, s.scheduled_start_time DESC`;

  const shiftAssignments: QueryResult<any> = await pool.query(query, values);
  return shiftAssignments.rows;
}

export async function getStatsForUser(
  userId: string,
  startDate?: string,
  endDate?: string,
): Promise<UserStats> {
  let values: (string | number)[] = [userId];
  let startParam = "";
  let endParam = "";
  let query = `WITH worked AS (
  SELECT
    type_id,
    shift_name,
    date,
    hourly_rate,
    hours
    FROM worked_shifts
    WHERE user_id = $1 AND date < CURRENT_DATE`;

  if (startDate) {
    values.push(startDate);
    query += ` AND date >= $${values.length}`;
    startParam = `$${values.length}`;
  }
  if (endDate) {
    values.push(endDate);
    query += ` AND date < $${values.length}`;
    endParam = `$${values.length}`;
  }

  query += `), acceptance AS (
  SELECT 
    COUNT(*) AS requested,
    COUNT(sa.id) AS assigned
    FROM shift_requests sr
    JOIN shifts s ON sr.shift_id = s.id
    LEFT JOIN shift_assignments sa ON sa.shift_id = sr.shift_id AND sa.user_id = sr.user_id
    WHERE sr.user_id = $1`;
  if (startDate) {
    query += ` AND s.date >= ${startParam}`;
  }

  if (endDate) {
    query += ` AND s.date < ${endParam}`;
  }

  query += `), attendance_per_month AS (
  SELECT
    EXTRACT(YEAR FROM s.date)  AS year,
    EXTRACT(MONTH FROM s.date) AS month_number,
    COUNT(*)                           AS total,
    COUNT(*) FILTER (WHERE sa.no_show) AS no_shows,
    ROUND(COUNT(*) FILTER (WHERE NOT sa.no_show) * 100.0 / COUNT(*), 0) AS rate
  FROM shift_assignments sa
  JOIN shifts s ON s.id = sa.shift_id
  WHERE sa.user_id = $1
    AND s.date < CURRENT_DATE`;

  if (startDate) {
    query += ` AND s.date >= ${startParam}`;
  }
  if (endDate) {
    query += ` AND s.date < ${endParam}`;
  }

  query += ` GROUP BY year, month_number
), per_month AS (
  SELECT
    EXTRACT(YEAR FROM date)  AS year,
    EXTRACT(MONTH FROM date) AS month_number,
    TO_CHAR(date, 'FMMonth') AS month_name,
    COUNT(*)                           AS count,
    ROUND(SUM(hours), 2)               AS hours,
    ROUND(SUM(hours * hourly_rate), 2) AS earnings
  FROM worked
  GROUP BY year, month_number, month_name
), per_type AS (
  SELECT
    type_id,
    shift_name,
    COUNT(*)                           AS count,
    ROUND(SUM(hours), 2)               AS hours,
    ROUND(SUM(hours * hourly_rate), 2) AS earnings
  FROM worked
  GROUP BY type_id, shift_name
), per_weekday AS (
  SELECT
    d.day_number,
    TO_CHAR(d2.day_date, 'FMDay')                        AS day_name,
    COUNT(w.date)                                        AS count,
    COALESCE(ROUND(SUM(w.hours), 2), 0)                  AS hours,
    COALESCE(ROUND(SUM(w.hours * w.hourly_rate), 2), 0)  AS earnings
  FROM generate_series(1, 7) AS d(day_number)
  -- give each day_number a real date to format consistently
  CROSS JOIN LATERAL (SELECT DATE '2024-01-01' + (d.day_number - 1) AS day_date) d2
  LEFT JOIN worked w ON EXTRACT(ISODOW FROM w.date) = d.day_number
  GROUP BY d.day_number, d2.day_date
)
SELECT json_build_object(
  'totalShifts',   COALESCE(SUM(count), 0),
  'averageMonth', (
  SELECT json_build_object(
    'count',    ROUND(AVG(count), 1),
    'hours',    ROUND(AVG(hours), 2),
    'earnings', ROUND(AVG(earnings), 2),
    'attendanceRate', (SELECT ROUND(AVG(rate), 0) FROM attendance_per_month)
  )
  FROM per_month
),
  'attendance', (
    SELECT json_build_object(
      'total',   COALESCE(SUM(total), 0),
      'noShows', COALESCE(SUM(no_shows), 0),
      'rate',    COALESCE(ROUND((SUM(total) - SUM(no_shows)) * 100.0 / NULLIF(SUM(total), 0), 0), 0)
    )
    FROM attendance_per_month
  ),
  'totalHours',    COALESCE(SUM(hours), 0),
  'totalEarnings', COALESCE(SUM(earnings), 0),
  'acceptance', (
    SELECT json_build_object(
      'requested', COALESCE(requested, 0),
      'assigned',  COALESCE(assigned, 0),
      'rate',      COALESCE(ROUND(assigned * 100.0 / NULLIF(requested, 0), 0), 0)
    )
    FROM acceptance
  ),
  'byShiftTypes', COALESCE(
    json_agg(
      json_build_object(
        'shift_name', shift_name,
        'count', count,
        'hours', hours,
        'earnings', earnings
      ) ORDER BY type_id
    ),
    '[]'
  ),
  'byWeekday', (
    SELECT COALESCE(
      json_agg(
        json_build_object(
          'day', day_name,
          'count', count,
          'hours', hours,
          'earnings', earnings
        ) ORDER BY day_number
      ),
      '[]'
    )
    FROM per_weekday
  ),
  'byMonth', (
    SELECT COALESCE(
      json_agg(
        json_build_object(
          'month', TO_CHAR(make_date(year::int, month_number::int, 1), 'YYYY-MM'),
          'count', COALESCE(p.count, 0),
          'hours', COALESCE(p.hours, 0),
          'earnings', COALESCE(p.earnings, 0),
          'attendanceRate', a.rate,
          'assigned', a.total::int,
          'noShows', a.no_shows::int
        ) ORDER BY year, month_number
      ),
      '[]'
    )
    -- start from attendance so months with only no-shows still appear
    FROM attendance_per_month a
    LEFT JOIN per_month p USING (year, month_number)
  )
) AS stats
FROM per_type`;

  const stats = await pool.query(query, values);
  return stats.rows[0].stats;
}

export async function updatePassword(userId: string, newPasswordHash: string) {
  const result = await pool.query<UserWithoutPassword>(
    `UPDATE users SET password_hash = $1, must_change_password = false WHERE id = $2 RETURNING id,username,email,phone,user_role,default_hourly_rate,is_active,first_name,last_name,date_of_birth`,
    [newPasswordHash, userId],
  );

  return result.rows[0];
}

export async function getNextShift(
  userId: string,
): Promise<AssignedShiftToUser | null> {
  const result = await pool.query(
    `SELECT sa.id AS assigned_shift_id,
    s.date,
    st.shift_name AS shift_type,
    s.scheduled_start_time,
    s.scheduled_end_time,
    sa.hourly_rate,
    sa.actual_start_time,
    sa.actual_end_time,
    sa.requested_at
    FROM shift_assignments sa INNER JOIN shifts s ON sa.shift_id = s.id INNER JOIN shift_types st ON s.shift_type_id = st.id
    WHERE sa.user_id = $1 AND (s.date + s.scheduled_start_time) > NOW() ORDER BY s.date ASC, s.scheduled_start_time 
    LIMIT 1 `,
    [userId],
  );

  return result.rows[0] || null;
}

export async function getRaceStats(month?: string) {
  const raceStats = await pool.query(
    `WITH race AS (
      SELECT u.id, u.first_name, u.last_name,
             COUNT(*)::int            AS shifts_worked,
             ROUND(SUM(ws.hours), 2)::float  AS hours_worked
      FROM worked_shifts ws
      JOIN users u ON u.id = ws.user_id
      WHERE u.user_role = 'student'
        AND ws.date < CURRENT_DATE
        AND ($1::text IS NULL OR (
              ws.date >= ($1 || '-01')::date
          AND ws.date <  ($1 || '-01')::date + INTERVAL '1 month'))
      GROUP BY u.id, u.first_name, u.last_name
    )
    SELECT COALESCE(json_agg(race ORDER BY hours_worked DESC), '[]') AS standings
    FROM race`,
    [month ?? null],
  );
  return raceStats.rows[0].standings;
}

export async function getRaceMonths() {
  const result = await pool.query(`
    SELECT DISTINCT TO_CHAR(date, 'YYYY-MM') as month
    FROM shift_assignments sa
    JOIN shifts s ON sa.shift_id = s.id
    WHERE date < CURRENT_DATE AND sa.no_show = false
    ORDER BY month DESC;
  `);

  return result.rows.map((row) => row.month);
}

export async function getMyGoal(userId: string, month: string) {
  const result = await pool.query(
    `
    SELECT amount::float FROM monthly_goals WHERE user_id = $1 AND month = ($2 || '-01')::date
    LIMIT 1
  `,
    [userId, month],
  );

  return result.rows[0];
}

export async function updateMyGoal(userId: string, amount: number) {
  const result = await pool.query(
    `INSERT INTO monthly_goals (user_id,month,amount) VALUES ($1, date_trunc('month', CURRENT_DATE)::date, $2)
    ON CONFLICT (user_id, month) DO UPDATE SET amount = EXCLUDED.amount
    RETURNING amount::float AS amount`,
    [userId, amount],
  );

  return result.rows[0];
}
export async function storePasswordResetToken(
  userId: string,
  resetTokenHash: string,
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      ` UPDATE password_reset_tokens SET used_at = now() WHERE user_id = $1 and used_at IS NULL;`,
      [userId],
    );
    await client.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, now() + INTERVAL '1 hour')`,
      [userId, resetTokenHash],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
  // Had to use a transaction to ensure that any previous unused tokens for the user are marked as used before inserting a new token. This prevents multiple valid tokens from existing for the same user at the same time.
}

export async function saveUploadContractToDb(
  userId: string,
  month: string,
  fileKey: string,
  fileName: string,
  fileSize: number,
): Promise<void> {
  await pool.query(
    `INSERT INTO contracts (user_id, contract_month, file_key, file_name, file_size)
      VALUES ($1, ($2 || '-01')::date, $3, $4, $5)
      ON CONFLICT (user_id, contract_month)
      DO UPDATE SET file_key = EXCLUDED.file_key, file_name = EXCLUDED.file_name,
      file_size = EXCLUDED.file_size, created_at = CURRENT_TIMESTAMP`,
    [userId, month, fileKey, fileName, fileSize],
  );
}

export async function getMyContract(
  userId: string,
  month: string,
): Promise<Contract> {
  const result = await pool.query<Contract>(
    `SELECT to_char(contract_month, 'YYYY-MM') AS month, 
    c.file_key AS s3_key, 
    c.created_at AS uploaded_at, 
    c.user_id,
    c.id,
    u.first_name as user_first_name,
    u.last_name as user_last_name,
    c.file_name,
    c.file_size
    FROM contracts c
    JOIN users u ON u.id = c.user_id 
    WHERE c.user_id = $1 AND c.contract_month = ($2 || '-01')::date`,
    [userId, month],
  );
  return result.rows[0];
}

export async function getMyContracts(
  userId: string,
): Promise<ContractMetadata[]> {
  const result = await pool.query<ContractMetadata>(
    `SELECT id,
    to_char(contract_month, 'YYYY-MM') AS contract_month,
    file_name,
    file_size,
    created_at AS uploaded_at
    FROM contracts
    WHERE user_id = $1
    ORDER BY contract_month DESC`,
    [userId],
  );
  return result.rows;
}

export async function getMyContractById(
  userId: string,
  contractId: string,
): Promise<Contract> {
  const result = await pool.query<Contract>(
    `SELECT 
    to_char(contract_month, 'YYYY-MM') AS month, 
    c.file_key AS s3_key, 
    c.created_at AS uploaded_at, 
    c.user_id,
    c.id,
    u.first_name as user_first_name,
    u.last_name as user_last_name,
    c.file_name,
    c.file_size
    FROM contracts c
    JOIN users u ON u.id = c.user_id 
    WHERE c.id = $1 AND c.user_id = $2`,
    [contractId, userId],
  );

  return result.rows[0];
}

export async function deleteContractById(
  contractId: string,
  userId: string,
): Promise<{ file_key: string } | null> {
  const res = await pool.query(
    `DELETE FROM contracts WHERE id = $1 AND user_id = $2 RETURNING file_key`,
    [contractId, userId],
  );
  return res.rows[0];
}
