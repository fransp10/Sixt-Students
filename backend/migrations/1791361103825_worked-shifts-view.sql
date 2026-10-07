-- Up Migration

CREATE VIEW worked_shifts AS
WITH t AS (
    SELECT sa.id, sa.shift_id, sa.user_id, sa.hourly_rate, s.date,
            st.id as type_id, st.shift_name,
            s.date + sa.actual_start_time AS start_ts,
            s.date + sa.actual_end_time + CASE WHEN sa.actual_end_time < sa.actual_start_time
            THEN interval '1 day' ELSE interval '0 day' END AS end_ts
    FROM shift_assignments sa
    JOIN shifts s ON sa.shift_id = s.id
    JOIN shift_types st ON s.shift_type_id = st.id
    WHERE NOT sa.no_show
    
), with_prev AS (
    SELECT *, MAX(end_ts) OVER(PARTITION BY user_id ORDER BY start_ts, id ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING) AS prev_end
    FROM t
)

SELECT id, shift_id, user_id, hourly_rate, date,type_id, shift_name, GREATEST(0, EXTRACT(EPOCH FROM end_ts - GREATEST(start_ts, COALESCE(prev_end,start_ts))) / 3600) AS hours
FROM with_prev

-- Down Migration

DROP VIEW worked_shifts;