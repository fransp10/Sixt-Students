import pool from "../db/db.js";
import { UserWithHashedPasswordType } from "../types/User.js";

export async function getUserByUsername(
  username: string,
): Promise<UserWithHashedPasswordType | null> {
  const user = await pool.query<UserWithHashedPasswordType>(
    `SELECT * FROM users WHERE username = $1`,
    [username],
  );

  return user.rows[0];
}
