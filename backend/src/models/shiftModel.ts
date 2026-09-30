import { QueryResult } from "pg";
import pool from "../db/db.js";
import { ModifyShiftFields } from "../types/ModifyShiftFields.js";
import {
  Shift,
  ShiftWithStudentsAndRequesters,
  SingleShiftRowToAggregate,
} from "../types/Shift.js";

export async function getAllShifts(): Promise<Shift[]> {
  const shifts = await pool.query<Shift>("SELECT * FROM shifts ORDER BY date");

  return shifts.rows;
}

export async function getShiftsBetweenDates(
  startDate: string | undefined,
  endDate: string | undefined,
): Promise<SingleShiftRowToAggregate[]> {
  let query = `SELECT 
      s.id AS shift_id,
      s.date,
      st.shift_name as shift_type,
      s.scheduled_start_time,
      s.scheduled_end_time,
      u.id AS user_id,
      u.first_name,
      u.last_name,
      sr.id AS shift_request_id,
      sr.created_at AS request_created_at,
      sa.id AS shift_assignment_id,
      sa.actual_start_time,
      sa.actual_end_time,
      sa.hourly_rate
      FROM shifts s
      JOIN shift_types st
      ON st.id = s.shift_type_id
      LEFT JOIN shift_assignments sa
      ON sa.shift_id = s.id
      LEFT JOIN users u
      ON u.id = sa.user_id
      LEFT JOIN shift_requests sr
      ON sr.shift_id = s.id AND sr.user_id = u.id`;

  const values = [];
  if (startDate) {
    values.push(startDate);
    query += ` WHERE s.date >= $${values.length}`;
  }

  if (endDate) {
    values.push(endDate);
    query += startDate
      ? ` AND s.date <= $${values.length}`
      : ` WHERE s.date <= $${values.length}`;
  }

  query += ` ORDER BY s.date, st.start_time`;

  const shifts = await pool.query<SingleShiftRowToAggregate>(query, [
    ...values,
  ]);

  return shifts.rows;
}

// userModel.ts
export async function getPasswordHashById(
  userId: string,
): Promise<string | undefined> {
  const result = await pool.query(
    "SELECT password_hash FROM users WHERE id = $1",
    [userId],
  );
  return result.rows[0]?.password_hash;
}

export async function getAllShiftsWithShiftRequestsBetweenDates(
  startDate: string | undefined,
  endDate: string | undefined,
): Promise<ShiftWithStudentsAndRequesters[]> {
  let query = `SELECT 
      s.id AS shift_id,
      s.date,
      st.shift_name AS shift_type,
      s.scheduled_start_time,
      s.scheduled_end_time,
      COALESCE(assigned.students, '[]'::json) AS students_assigned,
      COALESCE(requested.requesters, '[]'::json) AS students_requesting
      FROM shifts s
      JOIN shift_types st
      ON st.id = s.shift_type_id
      LEFT JOIN LATERAL (
        SELECT json_agg(
          json_build_object(
            'id', u.id,
            'first_name', u.first_name,
            'last_name', u.last_name,
            'username', u.username,
            'actual_start_time', sa.actual_start_time,
            'actual_end_time', sa.actual_end_time,
            'no_show', sa.no_show,
            'requested_at', sa.requested_at,
            'has_request', EXISTS (
              SELECT 1 FROM shift_requests sr
              WHERE sr.shift_id = sa.shift_id AND sr.user_id = sa.user_id
            )
          )
          ORDER BY sa.no_show, sa.requested_at, u.id
        ) AS students
      FROM shift_assignments sa
      JOIN users u ON u.id = sa.user_id
      WHERE sa.shift_id = s.id) assigned ON true
      LEFT JOIN LATERAL (
        SELECT json_agg(
          json_build_object(
            'id', u.id,
            'first_name', u.first_name,
            'last_name', u.last_name,
            'requested_at', sr.created_at,
            'username', u.username
          ) ORDER BY sr.created_at, u.id
        ) AS requesters
        FROM shift_requests sr
        JOIN users u ON u.id = sr.user_id
        WHERE sr.shift_id = s.id
    AND NOT EXISTS (
      SELECT 1 FROM shift_assignments sa
      WHERE sa.shift_id = sr.shift_id AND sa.user_id = sr.user_id
    )
) requested ON true`;

  const values = [];
  if (startDate) {
    values.push(startDate);
    query += ` WHERE s.date >= $${values.length}`;
  }

  if (endDate) {
    values.push(endDate);
    query += startDate
      ? ` AND s.date <= $${values.length}`
      : ` WHERE s.date <= $${values.length}`;
  }

  query += ` ORDER BY s.date, st.start_time`;

  const shifts = await pool.query<ShiftWithStudentsAndRequesters>(query, [
    ...values,
  ]);

  return shifts.rows;
}

export async function generateShiftsForDateRange(
  startDate: string,
  endDate: string,
): Promise<void> {
  await pool.query<Shift>(
    `INSERT INTO shifts (
    date,
    shift_type_id,
    scheduled_start_time,
    scheduled_end_time
    )
    SELECT
        shiftDates.shiftDate,
        st.id,
        st.start_time,
        st.end_time

    FROM shift_types st
    CROSS JOIN generate_series($1::date,$2::date,INTERVAL '1 day') AS shiftDates(shiftDate)
    ON CONFLICT (date, shift_type_id) DO NOTHING`,
    [startDate, endDate],
  );
}

export async function getShiftById(shiftId: string): Promise<Shift | null> {
  const shift = await pool.query<Shift>(`SELECT * FROM shifts WHERE id = $1`, [
    shiftId,
  ]);

  return shift.rows[0];
}

export async function modifyShift(
  shiftId: string,
  validFieldsToUpdate: ModifyShiftFields,
): Promise<Shift> {
  //   {scheduled_start_time : 2:00}

  const setClause = Object.entries(validFieldsToUpdate)
    .map(([key, value], index) => `${key} = $${index + 1}`)
    .join(", ");

  const values = Object.values(validFieldsToUpdate);

  const shiftIdParam = `$${values.length + 1}`;

  // One statement, so every CTE sees the shift's times from before the update.
  // Assignments still on the old schedule move with the shift;
  // adjusted and no-show assignments are left as they are.
  const modifiedShift = await pool.query<Shift>(
    `WITH old_shift AS (
       SELECT scheduled_start_time, scheduled_end_time
       FROM shifts WHERE id = ${shiftIdParam}
     ),
     updated_shift AS (
       UPDATE shifts SET ${setClause}
       WHERE id = ${shiftIdParam}
       RETURNING *
     ),
     moved_assignments AS (
       UPDATE shift_assignments sa
       SET actual_start_time = us.scheduled_start_time,
           actual_end_time   = us.scheduled_end_time
       FROM updated_shift us, old_shift os
       WHERE sa.shift_id = us.id
         AND sa.no_show = false
         AND sa.actual_start_time = os.scheduled_start_time
         AND sa.actual_end_time   = os.scheduled_end_time
     )
     SELECT * FROM updated_shift`,
    [...values, shiftId],
  );

  return modifiedShift.rows[0];
}

export async function getRequestsForShift(shiftId: string) {
  const shiftRequests = await pool.query(
    `SELECT sr.shift_id as shift_id, sr.user_id as user_id,sr.created_at as request_created_at, u.username, u.id as user_id, u.first_name, u.last_name FROM shift_requests sr
        INNER JOIN users u ON u.id = sr.user_id WHERE shift_id =$1 `,
    [shiftId],
  );

  return shiftRequests.rows;
}

export async function getShiftRequest(shiftId: string, userId: string) {
  const shiftRequests = await pool.query(
    `SELECT * FROM shift_requests WHERE user_id = $1 AND shift_id = $2 `,
    [userId, shiftId],
  );

  return shiftRequests.rows[0];
}

export async function createShiftRequest(
  shiftId: string,
  userId: string,
  UserDefaultHourlyRate: number,
) {
  const newShiftRequest = await pool.query(
    `INSERT INTO shift_requests (shift_id,user_id,hourly_rate) VALUES ($1,$2,$3) RETURNING *`,
    [shiftId, userId, UserDefaultHourlyRate],
  );
  return newShiftRequest.rows[0];
}

export async function deleteShiftRequest(shiftId: string, userId: string) {
  const deletedShiftRequest = await pool.query(
    `DELETE FROM shift_requests WHERE shift_id = $1 AND user_id = $2 RETURNING *`,
    [shiftId, userId],
  );

  return deletedShiftRequest.rows[0];
}

export async function getAssignmentsForShift(shiftId: string) {
  const shiftAssignments = await pool.query(
    `SELECT * FROM shift_assignments WHERE shift_id = $1`,
    [shiftId],
  );
  return shiftAssignments.rows;
}

export async function createAssignmentForShift(
  shiftId: string,
  userId: string,
  hourlyRate: number,
) {
  const newShiftAssignment = await pool.query(
    `INSERT INTO shift_assignments
     (shift_id, user_id, hourly_rate, requested_at, actual_start_time, actual_end_time)
   SELECT
     s.id,
     $2::int,
     $3::numeric,
     COALESCE(
       (SELECT sr.created_at FROM shift_requests sr
        WHERE sr.shift_id = $1 AND sr.user_id = $2),
       NOW()
     ),
     s.scheduled_start_time,
     s.scheduled_end_time
   FROM shifts s
   WHERE s.id = $1
   RETURNING *`,
    [shiftId, userId, hourlyRate],
  );

  return newShiftAssignment.rows[0];
}

export async function getShiftAssignment(shiftId: string, userId: string) {
  const shiftAssignment = await pool.query(
    `SELECT * FROM shift_assignments WHERE shift_id = $1 AND user_id = $2`,
    [shiftId, userId],
  );
  return shiftAssignment.rows[0];
}
export async function getShiftAssignmentById(userId: string) {
  const shiftAssignments = await pool.query(
    `SELECT sa.id as shift_assignmentId,sa.shift_id, sa.user_id,sa.actual_start_time, sa.actual_end_time, s.date, st.shift_name, s.scheduled_start_time, s.scheduled_end_time, sa.hourly_rate,sa.no_show
    FROM shift_assignments sa 
    JOIN shifts s ON s.id = sa.shift_id
    JOIN shift_types st ON st.id = s.shift_type_id 
    WHERE sa.user_id = $1
    ORDER BY s.date, s.scheduled_start_time`,
    [userId],
  );

  return shiftAssignments.rows;
}

export async function getShiftAssignmentsByIdBetweenDates(
  userId: string,
  startDate?: string,
  endDate?: string,
) {
  let query = `SELECT sa.id as shift_assignmentId, sa.shift_id, sa.user_id,sa.actual_start_time, sa.actual_end_time, s.date, st.shift_name, s.scheduled_start_time, s.scheduled_end_time, sa.hourly_rate,sa.no_show 
    FROM shift_assignments sa 
    JOIN shifts s ON s.id = sa.shift_id
    JOIN shift_types st ON st.id = s.shift_type_id 
    WHERE sa.user_id = $1`;

  const values = [userId];

  if (startDate) {
    values.push(startDate);
    query += ` AND s.date >= $${values.length}`;
  }
  if (endDate) {
    values.push(endDate);
    query += ` AND s.date <= $${values.length}`;
  }

  query += ` ORDER BY s.date, s.scheduled_start_time`;

  const shiftAssignments = await pool.query(query, [...values]);

  return shiftAssignments.rows;
}

export async function deleteShiftAssignment(shiftId: string, userId: string) {
  const deletedShiftAssignment = await pool.query(
    `DELETE FROM shift_assignments WHERE shift_id = $1 AND user_id = $2 RETURNING *`,
    [shiftId, userId],
  );

  return deletedShiftAssignment.rows[0];
}

export async function getShiftRequestsByUserId(userId: string) {
  const shiftRequests = await pool.query(
    `SELECT sr.id as shift_requestId, sr.shift_id, sr.user_id, sr.hourly_rate, s.date, st.shift_name, s.scheduled_start_time, s.scheduled_end_time 
    FROM shift_requests sr 
    JOIN shifts s ON s.id = sr.shift_id
    JOIN shift_types st ON st.id = s.shift_type_id 
    WHERE sr.user_id = $1
    ORDER BY s.date, s.scheduled_start_time`,
    [userId],
  );

  return shiftRequests.rows;
}

export async function modifyShiftAssignedAdmin(
  shiftId: string,
  userId: string,
  noShow: boolean,
  arrivedAt: string | null,
  leftAt: string | null,
) {
  const modifiedShiftAssignment = await pool.query(
    `UPDATE shift_assignments
     SET no_show = $1, actual_start_time = $2, actual_end_time = $3
     WHERE shift_id = $4 AND user_id = $5
     RETURNING *`,
    [noShow, arrivedAt, leftAt, shiftId, userId],
  );

  return modifiedShiftAssignment.rows[0];
}
