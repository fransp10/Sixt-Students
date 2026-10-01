-- Stats test data seed script.
-- Fills the last ~6 months with shift requests and assignments for every
-- active student, so the dashboard stats (totals, acceptance rate, by month,
-- by weekday, by shift type) have something to show.
--
-- Run AFTER seed_test_data.sql (it needs the students to exist).
-- Safe to re-run: "random" choices come from hashtext(), so the same
-- student/date always gets the same outcome, and inserts are ON CONFLICT DO NOTHING.
-- Dates are relative to CURRENT_DATE, so re-running later extends the data.

BEGIN;

-- 1) SHIFTS -------------------------------------------------------
-- One shift per day per shift_type, from the 1st of the month 5 months ago
-- until two weeks from today.

INSERT INTO shifts (date, shift_type_id, scheduled_start_time, scheduled_end_time)
SELECT d::date, st.id, st.start_time, st.end_time
FROM shift_types st
CROSS JOIN generate_series(
  (date_trunc('month', CURRENT_DATE) - interval '5 months')::date,
  CURRENT_DATE + 14,
  interval '1 day'
) AS d
ON CONFLICT (date, shift_type_id) DO NOTHING;

-- 2) SHIFT REQUESTS -----------------------------------------------
-- Each student picks one shift type per day and requests it on ~40% of days.
-- The request is made 2-13 days before the shift (never in the future).

WITH candidates AS (
  SELECT DISTINCT ON (u.id, s.date)
    s.id AS shift_id,
    s.date,
    u.id AS user_id,
    u.username,
    u.default_hourly_rate
  FROM users u
  CROSS JOIN shifts s
  WHERE u.user_role = 'student'
    AND u.is_active
    AND s.date >= (date_trunc('month', CURRENT_DATE) - interval '5 months')::date
    AND s.date <= CURRENT_DATE + 14
  ORDER BY u.id, s.date, hashtext(u.username || s.id::text)
)
INSERT INTO shift_requests (shift_id, user_id, hourly_rate, created_at)
SELECT
  c.shift_id,
  c.user_id,
  c.default_hourly_rate,
  LEAST(
    (c.date - (2 + abs(hashtext(c.username || c.date::text || 'lead')::bigint) % 12)::int)::timestamp
      + interval '10 hours',
    now()::timestamp
  )
FROM candidates c
WHERE abs(hashtext(c.username || c.date::text || 'req')::bigint) % 100 < 40
ON CONFLICT (shift_id, user_id) DO NOTHING;

-- 3) SHIFT ASSIGNMENTS --------------------------------------------
-- ~75% of requests for past shifts were approved. The rest count as rejected
-- (they lower the acceptance rate). Future requests stay pending.
-- Requests are kept after approval, same as createAssignmentForShift().

INSERT INTO shift_assignments
  (shift_id, user_id, hourly_rate, requested_at, actual_start_time, actual_end_time)
SELECT
  sr.shift_id,
  sr.user_id,
  sr.hourly_rate,
  sr.created_at,
  s.scheduled_start_time,
  s.scheduled_end_time
FROM shift_requests sr
JOIN shifts s ON s.id = sr.shift_id
JOIN users u ON u.id = sr.user_id
WHERE u.user_role = 'student'
  AND s.date < CURRENT_DATE
  AND s.date >= (date_trunc('month', CURRENT_DATE) - interval '5 months')::date
  AND abs(hashtext(u.username || s.date::text || 'assign')::bigint) % 100 < 75
ON CONFLICT (shift_id, user_id) DO NOTHING;

-- 4) VARIED HOURS -------------------------------------------------
-- So hours/earnings aren't all exactly 8h:
-- ~10% arrived 30 min late, ~15% left 1 hour early.
-- Times are set from the schedule (not relative), so re-running doesn't stack.

UPDATE shift_assignments sa
SET actual_start_time = s.scheduled_start_time + interval '30 minutes'
FROM shifts s, users u
WHERE sa.shift_id = s.id
  AND sa.user_id = u.id
  AND sa.no_show = false
  AND abs(hashtext(u.username || s.date::text || 'late')::bigint) % 100 < 10;

UPDATE shift_assignments sa
SET actual_end_time = s.scheduled_end_time - interval '1 hour'
FROM shifts s, users u
WHERE sa.shift_id = s.id
  AND sa.user_id = u.id
  AND sa.no_show = false
  AND abs(hashtext(u.username || s.date::text || 'early')::bigint) % 100 < 15;

-- 5) NO-SHOWS -----------------------------------------------------
-- ~8% of past assignments were no-shows (times must be NULL, see no_show_matches_times).

UPDATE shift_assignments sa
SET no_show = true, actual_start_time = NULL, actual_end_time = NULL
FROM shifts s, users u
WHERE sa.shift_id = s.id
  AND sa.user_id = u.id
  AND s.date < CURRENT_DATE
  AND abs(hashtext(u.username || s.date::text || 'noshow')::bigint) % 100 < 8;

COMMIT;
