-- Up Migration
ALTER TABLE users ALTER COLUMN email TYPE varchar(254);
CREATE UNIQUE INDEX users_email_lower_unique ON users (lower(email));
-- Down Migration

DROP INDEX users_email_lower_unique;
ALTER TABLE users ALTER COLUMN email TYPE varchar(55);