-- Demo data seed.
--
-- Fills an EMPTY database with:
--   * 1 admin and 20 active students (all fictional)
--   * shifts for the last 8 full months, this month, and the next 3 weeks
--   * shift requests, approved assignments, no-shows, late arrivals and early leaves
--   * pending requests for the next 3 weeks, for the admin to approve
--   * a contract for every month a student worked
--   * monthly goals, payroll budgets and payroll payments
--
-- Logins (password for both: password123):
--   demo.admin     the admin
--   demo.student   a student
-- The other 19 students have a password nobody knows, so visitors can't log in as them.
--
-- Everything is relative to today, and "random" numbers come from roll() below, so the same
-- inputs always give the same data. Run wipe_demo_data.sql first to run it again.

BEGIN;

-- 0) SAFETY CHECK ---------------------------------------------------
-- Stop instead of mixing demo data into a database that already has users.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM users) THEN
    RAISE EXCEPTION 'users is not empty. This seed only fills an empty database (see wipe_demo_data.sql).';
  END IF;
END $$;

-- 1) HELPERS --------------------------------------------------------

-- roll('ana', date '2026-03-04', 'request') -> a number from 0 to 99.
-- The same inputs always give the same number, so re-seeding gives identical data.
-- "what" is a label, so different decisions about the same person and day are independent.
CREATE OR REPLACE FUNCTION pg_temp.roll(who text, day date, what text) RETURNS int
LANGUAGE sql IMMUTABLE AS $$
  SELECT (abs(hashtext(who || day::text || what)::bigint) % 100)::int
$$;

-- The month boundaries used throughout, computed once.
CREATE TEMP TABLE period ON COMMIT DROP AS
SELECT
  (date_trunc('month', CURRENT_DATE) - interval '8 months')::date AS history_start, -- first day of the oldest month
  (date_trunc('month', CURRENT_DATE) - interval '1 month')::date  AS last_month,
  date_trunc('month', CURRENT_DATE)::date                         AS this_month;

-- 2) USERS ----------------------------------------------------------

-- The admin. Hash of 'password123' (Postgres can't compute argon2, so it is pasted in).
INSERT INTO users
  (username, email, phone, password_hash, user_role, default_hourly_rate,
   date_of_birth, first_name, last_name, is_active, must_change_password, created_at)
SELECT
  'demo.admin', 'demo.admin@example.com', '0910000000',
  '$argon2id$v=19$m=65536,p=4,t=3$vxqn6eETT08nEliO2GmIbw$MhHVfPvxjLGTiECrCcifA1CJzu74MjZuyLVhMTUCy/0',
  'admin', 0, DATE '1988-04-12', 'Maja', 'Horvat', true, false,
  p.history_start - interval '1 month'
FROM period p;

-- The students. Names are plain ASCII on purpose (the contract PDF font has no č/ć/đ).
-- Account created one month before the history starts, so every month has a student record.
INSERT INTO users
  (username, email, phone, password_hash, user_role, default_hourly_rate,
   date_of_birth, first_name, last_name, is_active, must_change_password, created_at)
SELECT
  s.username,
  s.username || '@example.com',
  '091' || lpad(row_number() OVER ()::text, 7, '0'),      -- 0910000001, 0910000002, ...
  CASE
    WHEN s.username = 'demo.student'
      THEN '$argon2id$v=19$m=65536,p=4,t=3$vxqn6eETT08nEliO2GmIbw$MhHVfPvxjLGTiECrCcifA1CJzu74MjZuyLVhMTUCy/0'  -- password123
    ELSE '$argon2id$v=19$m=65536,p=4,t=3$mjlZlULTV18Y+kuNthp+cg$hC1f1fJsXj4VM8CuL13FGNt1+3knTk3X2FkRumaFvJ0'    -- random, thrown away
  END,
  'student',
  s.hourly_rate,
  DATE '2000-01-01' + pg_temp.roll(s.username, DATE '2000-01-01', 'birthday') * 20,  -- born between 2000 and 2005
  s.first_name,
  s.last_name,
  true,
  false,
  p.history_start - interval '1 month'
FROM (VALUES
  ('demo.student',   'Luka',     'Maric',     7.00),
  ('petra.novak',    'Petra',    'Novak',     6.56),
  ('ivan.juric',     'Ivan',     'Juric',     7.50),
  ('nika.pavlic',    'Nika',     'Pavlic',    6.56),
  ('tomislav.vuk',   'Tomislav', 'Vuk',       7.00),
  ('marta.knezevic', 'Marta',    'Knezevic',  6.56),
  ('josip.tomic',    'Josip',    'Tomic',     7.50),
  ('sara.milic',     'Sara',     'Milic',     6.56),
  ('matej.babic',    'Matej',    'Babic',     7.00),
  ('ana.kovacevic',  'Ana',      'Kovacevic', 6.56),
  ('filip.radic',    'Filip',    'Radic',     7.00),
  ('lana.peric',     'Lana',     'Peric',     6.56),
  ('dino.matic',     'Dino',     'Matic',     7.50),
  ('ema.bozic',      'Ema',      'Bozic',     6.56),
  ('karlo.simic',    'Karlo',    'Simic',     7.00),
  ('iva.grgic',      'Iva',      'Grgic',     6.56),
  ('mario.loncar',   'Mario',    'Loncar',    7.00),
  ('tea.vidovic',    'Tea',      'Vidovic',   6.56),
  ('bruno.pavic',    'Bruno',    'Pavic',     7.50),
  ('mia.zoric',      'Mia',      'Zoric',     6.56)
) AS s(username, first_name, last_name, hourly_rate)
CROSS JOIN period p;

-- 3) SHIFTS -----------------------------------------------------------
-- One shift per day per shift type (morning, middle, afternoon),
-- from the start of the history until 3 weeks from today.

INSERT INTO shifts (date, shift_type_id, scheduled_start_time, scheduled_end_time)
SELECT d::date, st.id, st.start_time, st.end_time
FROM period p
CROSS JOIN shift_types st
CROSS JOIN generate_series(p.history_start, CURRENT_DATE + 21, interval '1 day') AS d;

-- 4) SHIFT REQUESTS ---------------------------------------------------

-- Each student has at most ONE shift they would take on a given day, picked at random.
-- This stops anyone from requesting overlapping shifts on the same day.
CREATE TEMP TABLE student_day_pick ON COMMIT DROP AS
SELECT DISTINCT ON (u.id, s.date)
  u.id                 AS user_id,
  u.username,
  u.default_hourly_rate AS hourly_rate,
  s.id                 AS shift_id,
  s.date               AS shift_date
FROM users u
CROSS JOIN shifts s
WHERE u.user_role = 'student'
ORDER BY u.id, s.date, hashtext(u.username || s.id::text);

-- A student requests that shift on ~45% of past days and ~25% of upcoming days
-- (fewer upcoming requests keeps the admin's pending list a sensible size).
-- created_at = when the request was made:
--   past shifts:     2 to 13 days before the shift, during the day
--   upcoming shifts: sometime in the last 10 days
INSERT INTO shift_requests (shift_id, user_id, hourly_rate, created_at)
SELECT
  shift_id,
  user_id,
  hourly_rate,
  CASE
    WHEN shift_date < CURRENT_DATE THEN
      shift_date::timestamp
        - interval '1 day'  * (2 + pg_temp.roll(username, shift_date, 'days_before') % 12)
        + interval '1 hour' * (8 + pg_temp.roll(username, shift_date, 'hour') % 10)
    ELSE
      now()::timestamp - interval '10 days' * (pg_temp.roll(username, shift_date, 'posted') / 100.0)
  END
FROM student_day_pick
WHERE pg_temp.roll(username, shift_date, 'request') <
  CASE WHEN shift_date < CURRENT_DATE THEN 45 ELSE 25 END;

-- 5) ASSIGNMENTS (the approved requests) --------------------------------
-- A request is approved with a chance that depends on when the shift is:
--   past shifts       75%
--   today .. +3 days  90%   (so today's shifts and this week's calendar are staffed)
--   +4 .. +7 days     60%
--   after that         0%   (all stay pending: this is the admin's approval queue)
-- A request with no assignment is either rejected (past shift) or pending (upcoming shift).
--
-- For past shifts we also add some realism:
--   5% no-show, 10% arrived 30 minutes late, 15% left 1 hour early.
-- (A no-show has no times at all, see the no_show_matches_times constraint.)

WITH approved AS (
  SELECT
    sr.shift_id,
    sr.user_id,
    sr.hourly_rate,
    sr.created_at AS requested_at,
    s.date        AS shift_date,
    s.scheduled_start_time,
    s.scheduled_end_time,
    u.username
  FROM shift_requests sr
  JOIN shifts s ON s.id = sr.shift_id
  JOIN users u  ON u.id = sr.user_id
  WHERE pg_temp.roll(u.username, s.date, 'approve') <
    CASE
      WHEN s.date <  CURRENT_DATE     THEN 75
      WHEN s.date <= CURRENT_DATE + 3 THEN 90
      WHEN s.date <= CURRENT_DATE + 7 THEN 60
      ELSE 0
    END
), with_attendance AS (
  SELECT *,
    shift_date < CURRENT_DATE AND pg_temp.roll(username, shift_date, 'no_show') < 5  AS no_show,
    shift_date < CURRENT_DATE AND pg_temp.roll(username, shift_date, 'late')    < 10 AS arrived_late,
    shift_date < CURRENT_DATE AND pg_temp.roll(username, shift_date, 'early')   < 15 AS left_early
  FROM approved
)
INSERT INTO shift_assignments
  (shift_id, user_id, hourly_rate, requested_at, no_show, actual_start_time, actual_end_time)
SELECT
  shift_id,
  user_id,
  hourly_rate,
  requested_at,
  no_show,
  CASE
    WHEN no_show      THEN NULL
    WHEN arrived_late THEN scheduled_start_time + interval '30 minutes'
    ELSE scheduled_start_time
  END,
  CASE
    WHEN no_show    THEN NULL
    WHEN left_early THEN scheduled_end_time - interval '1 hour'
    ELSE scheduled_end_time
  END
FROM with_attendance;

-- 6) CONTRACTS ------------------------------------------------------------
-- A student has a contract for every month they worked, up to and including this month.
-- Exception: three students have NOT uploaded this month's contract yet, so the demo shows
-- the "missing contract" states (an upload prompt for demo.student, a notice for the admin).
--
-- The file itself is uploaded to S3 by the reset script, which also sets the real file_size.
-- file_key has the same format as the real upload: contracts/<userId>/<YYYY-MM>.pdf

WITH months_worked AS (
  SELECT DISTINCT user_id, date_trunc('month', date)::date AS month
  FROM worked_shifts
  WHERE hours > 0
)
INSERT INTO contracts (user_id, contract_month, file_key, file_name, file_size)
SELECT
  mw.user_id,
  mw.month,
  'contracts/' || mw.user_id || '/' || to_char(mw.month, 'YYYY-MM') || '.pdf',
  'contract-' || to_char(mw.month, 'YYYY-MM') || '.pdf',
  0
FROM months_worked mw
JOIN users u ON u.id = mw.user_id
CROSS JOIN period p
WHERE mw.month <= p.this_month
  AND NOT (mw.month = p.this_month
           AND u.username IN ('demo.student', 'petra.novak', 'ivan.juric'));

-- 7) MONTHLY GOALS ----------------------------------------------------------
-- Every student gets an earnings goal for every month: 400, 500, 600, 700 or 800.

INSERT INTO monthly_goals (user_id, month, amount)
SELECT
  u.id,
  m::date,
  400 + (pg_temp.roll(u.username, m::date, 'goal') % 5) * 100
FROM users u
CROSS JOIN period p
CROSS JOIN generate_series(p.history_start, p.this_month, interval '1 month') AS m
WHERE u.user_role = 'student';

-- 8) PAYROLL ----------------------------------------------------------------

-- What each student earned in each FINISHED month (hours * rate, from the worked_shifts view).
-- The current month is not finished, so it is not here.
CREATE TEMP TABLE monthly_earnings ON COMMIT DROP AS
SELECT
  user_id,
  date_trunc('month', date)::date AS month,
  ROUND(SUM(hours * hourly_rate), 2) AS amount
FROM worked_shifts
WHERE date < (SELECT this_month FROM period)
GROUP BY user_id, date_trunc('month', date)
HAVING SUM(hours) > 0;

-- Budget per finished month: what was actually earned plus 8%, rounded up to the next 100.
INSERT INTO payroll_budgets (month, amount)
SELECT month, CEIL(SUM(amount) * 1.08 / 100) * 100
FROM monthly_earnings
GROUP BY month;

-- This month has no earnings yet, so it reuses last month's budget.
INSERT INTO payroll_budgets (month, amount)
SELECT p.this_month, b.amount
FROM period p
JOIN payroll_budgets b ON b.month = p.last_month;

-- Payments, same rule as the app: only students WITH a contract get paid, for what they earned.
--   months before last month: everyone is paid, 3 days after the month ended
--   last month:               only every second student is paid (yesterday), the rest are still waiting
WITH payable AS (
  SELECT
    e.month,
    e.user_id,
    e.amount,
    row_number() OVER (PARTITION BY e.month ORDER BY e.user_id) AS position_in_month
  FROM monthly_earnings e
  JOIN contracts c ON c.user_id = e.user_id AND c.contract_month = e.month
)
INSERT INTO payroll_payments (month, user_id, paid_amount, paid_at, paid_by_admin_id)
SELECT
  pa.month,
  pa.user_id,
  pa.amount,
  CASE
    WHEN pa.month = p.last_month THEN now()::timestamp - interval '1 day'
    ELSE pa.month + interval '1 month 3 days 10 hours'
  END,
  admin.id
FROM payable pa
CROSS JOIN period p
CROSS JOIN (SELECT id FROM users WHERE username = 'demo.admin') admin
WHERE pa.month < p.last_month
   OR pa.position_in_month % 2 = 1;

COMMIT;
