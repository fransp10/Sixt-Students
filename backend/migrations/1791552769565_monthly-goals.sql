-- Up Migration
CREATE TABLE monthly_goals (
    user_id int NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month date NOT NULL CHECK (EXTRACT(DAY FROM month) = 1),
    amount numeric(10,2) NOT NULL CHECK (amount >= 0),
    PRIMARY KEY (user_id, month)
);
-- Down Migration

DROP TABLE monthly_goals;