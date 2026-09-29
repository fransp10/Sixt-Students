-- Up Migration

-- One-time backfill: run once on any database that has assignments created
-- before actual_start_time/actual_end_time were filled in on insert.
--
-- NULL times now mean "no show", so every assignment that isn't a no-show
-- needs real times. Copies them from the shift's schedule.
-- Safe to re-run: only touches rows that still have NULL times.


UPDATE shift_assignments sa
SET actual_start_time = COALESCE(sa.actual_start_time, s.scheduled_start_time),
    actual_end_time   = COALESCE(sa.actual_end_time,   s.scheduled_end_time)
FROM shifts s
WHERE sa.shift_id = s.id
  AND sa.no_show = false
  AND (sa.actual_start_time IS NULL OR sa.actual_end_time IS NULL);
-- Down Migration