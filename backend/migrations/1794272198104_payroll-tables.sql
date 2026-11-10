-- Up Migration


CREATE TABLE payroll_budgets (
    month date PRIMARY KEY CHECK (EXTRACT(DAY FROM month) = 1),
    amount numeric(10,2) NOT NULL CHECK (amount > 0)
);

CREATE TABLE payroll_payments  (
    month date CHECK (EXTRACT(DAY FROM month) = 1),
    user_id INT NOT NULL REFERENCES users(id),
    paid_amount numeric(10,2) NOT NULL CHECK (paid_amount >= 0),
    paid_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    paid_by_admin_id INT REFERENCES users(id) ON DELETE SET NULL,
    PRIMARY KEY (month, user_id)
);


-- Down Migration

DROP TABLE IF EXISTS payroll_payments;
DROP TABLE IF EXISTS payroll_budgets;