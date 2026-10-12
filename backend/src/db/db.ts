import pg, { types } from "pg";
const { Pool } = pg;

// This makes TIME format from HH:MM:SS to HH:MM
types.setTypeParser(types.builtins.TIME, (value: string) => value.slice(0, 5));
pg.types.setTypeParser(1082, (val) => val); // 1082 = DATE
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

export default pool;
