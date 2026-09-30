import { QueryResult } from "pg";
import pool from "../db/db.js";
import {
  CreateUserModel,
  UserRoles,
  UserWithoutPassword,
  UserWithPassword,
} from "../types/User.js";
import { AllowedFields } from "../types/AllowedFields.js";
import { AssignedShiftToUser, Shift, UserStats } from "../types/Shift.js";

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
}: CreateUserModel): Promise<UserWithPassword> {
  const result: QueryResult<UserWithPassword> = await pool.query(
    `INSERT INTO users (
      username, 
      email,
      phone,
      password_hash,
      user_role,
      default_hourly_rate,
      date_of_birth,
      first_name,
      last_name,
    )
     VALUES ($1,$2 ,$3,$4,$5,$6,$7,$8,$9) 
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
      last_name
     `,
    [
      username,
      email ?? null,
      phone ?? null,
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
         CASE WHEN sa.no_show THEN 0 ELSE
         (EXTRACT(EPOCH FROM (
         sa.actual_end_time - 
         sa.actual_start_time + 
         CASE WHEN sa.actual_end_time < 
         sa.actual_start_time 
         THEN INTERVAL '1 day' ELSE INTERVAL '0' END)) / 3600)::int
         END AS hours_worked
  FROM shift_assignments sa
  JOIN shifts s       ON sa.shift_id = s.id
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
  startDate: string,
  endDate: string,
): Promise<UserStats> {
  let values: (string | number)[] = [userId];
  let query = `WITH worked AS (
  SELECT
    st.id   AS type_id,
    st.shift_name,
    s.date,
    sa.hourly_rate,
    EXTRACT(EPOCH FROM (
        sa.actual_end_time
      - sa.actual_start_time
      + CASE
          WHEN sa.actual_end_time
             < sa.actual_start_time
          THEN interval '24 hours'
          ELSE interval '0'
        END
    )) / 3600 AS hours
  FROM shift_assignments sa
  JOIN shifts      s  ON s.id  = sa.shift_id
  JOIN shift_types st ON st.id = s.shift_type_id
  WHERE sa.user_id = $1 AND sa.no_show = false`;

  if (startDate) {
    query += ` AND s.date >= $2`;
    values.push(startDate);
  }
  if (endDate) {
    query += ` AND s.date < $3`;
    values.push(endDate);
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
    query += ` AND s.date >= $2`;
  }

  if (endDate) {
    query += ` AND s.date < $3`;
  }

  query += `), per_month AS (
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
      json_object_agg(year::int::text, months ORDER BY year),
      '{}'
    )
    FROM (
      SELECT
        year,
        json_agg(
          json_build_object(
            'month', month_name,
            'count', count,
            'hours', hours,
            'earnings', earnings
          ) ORDER BY month_number
        ) AS months
      FROM per_month
      GROUP BY year
    ) y
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
