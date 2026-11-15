-- Up Migration

-- id can only ever be true, so the table holds a single row
CREATE TABLE app_settings (
    id boolean PRIMARY KEY DEFAULT true CHECK (id),
    new_student_hourly_rate numeric(10,2) NOT NULL DEFAULT 6.56
        CHECK (new_student_hourly_rate > 0 AND new_student_hourly_rate <= 100),
    new_student_monthly_goal numeric(10,2) NOT NULL DEFAULT 600
        CHECK (new_student_monthly_goal >= 0)
);

INSERT INTO app_settings DEFAULT VALUES;

-- Down Migration

DROP TABLE IF EXISTS app_settings;
