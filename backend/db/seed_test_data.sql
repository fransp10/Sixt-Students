-- Test data seed script.
-- Password for every seeded user is: password123
-- (hash generated via `node -e "require('argon2').hash('password123')..."`,
-- since Postgres cannot compute argon2 hashes in plain SQL)
-- Safe to re-run: every insert is ON CONFLICT DO NOTHING.

-- 1) USERS -------------------------------------------------------

INSERT INTO users
  (username, email, phone, password_hash, user_role, default_hourly_rate, date_of_birth, first_name, last_name, is_active)
VALUES
  ('admin.horvat',   'admin@example.com',   '0910000001', '$argon2id$v=19$m=65536,p=4,t=3$vxqn6eETT08nEliO2GmIbw$MhHVfPvxjLGTiECrCcifA1CJzu74MjZuyLVhMTUCy/0', 'admin',   0,    '1990-01-01', 'Ana',   'Horvat',  true),
  ('fran.sipek',     'fran@example.com',    '0910000002', '$argon2id$v=19$m=65536,p=4,t=3$vxqn6eETT08nEliO2GmIbw$MhHVfPvxjLGTiECrCcifA1CJzu74MjZuyLVhMTUCy/0', 'student', 8.5,  '2002-03-14', 'Fran',  'Sipek',   true),
  ('marko.kovac',    'marko@example.com',   '0910000003', '$argon2id$v=19$m=65536,p=4,t=3$vxqn6eETT08nEliO2GmIbw$MhHVfPvxjLGTiECrCcifA1CJzu74MjZuyLVhMTUCy/0', 'student', 8.5,  '2001-07-22', 'Marko', 'Kovac',   true),
  ('luka.matic',     'luka@example.com',    '0910000004', '$argon2id$v=19$m=65536,p=4,t=3$vxqn6eETT08nEliO2GmIbw$MhHVfPvxjLGTiECrCcifA1CJzu74MjZuyLVhMTUCy/0', 'student', 8.5,  '2002-11-02', 'Luka',  'Matic',   true),
  ('ante.babic',     'ante@example.com',    '0910000005', '$argon2id$v=19$m=65536,p=4,t=3$vxqn6eETT08nEliO2GmIbw$MhHVfPvxjLGTiECrCcifA1CJzu74MjZuyLVhMTUCy/0', 'student', 8.5,  '2003-05-18', 'Ante',  'Babic',   true),
  ('jakov.strcic',   'jakov@example.com',   '0910000006', '$argon2id$v=19$m=65536,p=4,t=3$vxqn6eETT08nEliO2GmIbw$MhHVfPvxjLGTiECrCcifA1CJzu74MjZuyLVhMTUCy/0', 'student', 8.5,  '2002-09-09', 'Jakov', 'Strcic',  true)
ON CONFLICT (username) DO NOTHING;

-- 2) SHIFTS -------------------------------------------------------
-- Generates one shift per day, per shift_type, for the current week and next week.
-- Mirrors generateShiftsForDateRange() in shiftModel.ts.

INSERT INTO shifts (date, shift_type_id, scheduled_start_time, scheduled_end_time)
SELECT
  shiftDates.shiftDate,
  st.id,
  st.start_time,
  st.end_time
FROM shift_types st
CROSS JOIN generate_series(
  date_trunc('week', CURRENT_DATE)::date,
  (date_trunc('week', CURRENT_DATE) + interval '13 days')::date,
  interval '1 day'
) AS shiftDates(shiftDate)
ON CONFLICT (date, shift_type_id) DO NOTHING;

-- 3) SHIFT ASSIGNMENTS --------------------------------------------
-- fran.sipek is assigned to this week's Monday morning shift (along with marko.kovac),
-- and to next Friday's afternoon shift alone.

INSERT INTO shift_assignments (shift_id, user_id, hourly_rate)
SELECT s.id, u.id, u.default_hourly_rate
FROM (VALUES
  ('fran.sipek',  date_trunc('week', CURRENT_DATE)::date,               'morning'),
  ('marko.kovac', date_trunc('week', CURRENT_DATE)::date,               'morning'),
  ('fran.sipek',  (date_trunc('week', CURRENT_DATE) + interval '11 days')::date, 'afternoon')
) AS v(username, shift_date, shift_type)
JOIN shifts s ON s.date = v.shift_date
JOIN shift_types st ON st.id = s.shift_type_id AND st.shift_name = v.shift_type
JOIN users u ON u.username = v.username
ON CONFLICT DO NOTHING;

-- 4) SHIFT REQUESTS -------------------------------------------------
-- luka.matic and ante.babic have both requested this week's Wednesday morning shift,
-- still waiting for admin approval.

INSERT INTO shift_requests (shift_id, user_id, hourly_rate)
SELECT s.id, u.id, u.default_hourly_rate
FROM (VALUES
  ('luka.matic', (date_trunc('week', CURRENT_DATE) + interval '2 days')::date, 'morning'),
  ('ante.babic', (date_trunc('week', CURRENT_DATE) + interval '2 days')::date, 'morning'),
  ('jakov.strcic', (date_trunc('week', CURRENT_DATE) + interval '1 day')::date, 'middle')
) AS v(username, shift_date, shift_type)
JOIN shifts s ON s.date = v.shift_date
JOIN shift_types st ON st.id = s.shift_type_id AND st.shift_name = v.shift_type
JOIN users u ON u.username = v.username
ON CONFLICT DO NOTHING;
