-- Up Migration
ALTER TABLE contracts
    ADD COLUMN file_name VARCHAR(255),
    ADD COLUMN file_size INT CHECK (file_size >= 0);

-- backfill rows uploaded before these columns existed: name from the S3 key, size unknown
UPDATE contracts
SET file_name = regexp_replace(file_key, '^.*/', ''),
    file_size = 0
WHERE file_name IS NULL;

ALTER TABLE contracts
    ALTER COLUMN file_name SET NOT NULL,
    ALTER COLUMN file_size SET NOT NULL;

-- Down Migration
ALTER TABLE contracts
    DROP COLUMN file_name,
    DROP COLUMN file_size;
