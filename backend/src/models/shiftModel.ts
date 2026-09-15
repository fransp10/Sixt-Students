import pool from "../pool/db.js";
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
