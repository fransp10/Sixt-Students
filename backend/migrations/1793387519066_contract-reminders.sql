-- Up Migration
CREATE TABLE contract_reminders (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- nullable so reminder history survives an admin account being deleted
    sent_by_admin_id INT REFERENCES users(id) ON DELETE SET NULL,
    contract_month DATE NOT NULL CHECK (EXTRACT(DAY FROM contract_month) = 1),
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- covers "latest reminder for this student+month" lookups
CREATE INDEX contract_reminders_student_month_sent_at_idx
    ON contract_reminders (student_id, contract_month, sent_at DESC);
-- Down Migration

DROP TABLE contract_reminders;
