-- Up Migration
INSERT INTO shift_types (shift_name, start_time, end_time) VALUES
    ('morning', '07:00:00', '15:00:00'),
    ('middle', '10:00:00', '18:00:00'),
    ('afternoon', '14:00:00', '22:00:00');
-- Down Migration

DELETE FROM shift_types;