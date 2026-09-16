import pool from "../pool/db.js";
import { UserWithHashedPasswordType } from "../types/User.js";

export async function getUserByUsername(
  username: string,
): Promise<UserWithHashedPasswordType | undefined> {
  const user = await pool.query<UserWithHashedPasswordType>(
    `SELECT * FROM users WHERE username = $1`,
    [username],
  );

  return user.rows[0];
}
