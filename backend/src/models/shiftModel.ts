import { QueryResult } from "pg";
import pool from "../pool/db.js";
import { ModifyShiftFields } from "../types/ModifyShiftFieldsType.js";
import { Shift } from "../types/Shift.js";

export async function getAllShifts(): Promise<Shift[]> {
  const shifts = await pool.query<Shift>("SELECT * FROM shifts ORDER BY date");

  return shifts.rows;
}

export async function getShiftsBetweenDates(
  startDate: string,
  endDate: string,
): Promise<Shift[]> {
  const shifts = await pool.query<Shift>(
    `SELECT 
    s.id,
    s.date,
    st.shift_name AS shift_type,
    s.scheduled_start_time,
    s.scheduled_end_time 
    FROM shifts s INNER JOIN shift_types st ON s.shift_type_id = st.id 
    WHERE date BETWEEN $1 AND $2 
    ORDER BY s.date,st.start_time`,
    [startDate, endDate],
  );

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

  const modifiedShift = await pool.query<Shift>(
    `UPDATE shifts SET
     ${setClause}
     WHERE id = $${values.length + 1}
     RETURNING *`,
    [...values, shiftId],
  );

  return modifiedShift.rows[0];
}

export async function getRequestsForShift(shiftId: string) {
  const shiftRequests = await pool.query(
    `SELECT * FROM shift_requests
        WHERE shift_id =$1`,
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
    `INSERT INTO shift_assignments (shift_id,user_id,hourly_rate) VALUES ($1,$2,$3) RETURNING *`,
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

export async function deleteShiftAssignment(shiftId: string, userId: string) {
  const deletedShiftAssignment = await pool.query(
    `DELETE FROM shift_assignments WHERE shift_id = $1 AND user_id = $2 RETURNING *`,
    [shiftId, userId],
  );

  return deletedShiftAssignment.rows[0];
}
