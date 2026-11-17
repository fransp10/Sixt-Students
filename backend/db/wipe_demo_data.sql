-- Empties every table that seed_demo.sql fills, so the seed can be run again.
--
-- !! DESTRUCTIVE !! Only run this against the DEMO database.
--
-- shift_types and app_settings are not touched: the migrations create them.
-- CASCADE also empties everything that points at these tables
-- (assignments, requests, contracts, goals, payments, tokens, reminders).
-- RESTART IDENTITY makes ids start from 1 again, so each demo reset gives the same ids
-- (and with them the same S3 contract keys).

TRUNCATE users, shifts, payroll_budgets RESTART IDENTITY CASCADE;
