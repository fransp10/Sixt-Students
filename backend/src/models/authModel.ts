import pool from "../db/db.js";
import { refreshTokenModel } from "../types/tokens.js";
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

export async function resetUserPassword(
  tokenHash: string,
  passwordHash: string,
): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const tokenResult = await client.query<{ user_id: number }>(
      `UPDATE password_reset_tokens SET used_at = NOW() WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now() RETURNING user_id;`,
      [tokenHash],
    );
    if (!tokenResult.rows[0]) {
      await client.query("ROLLBACK");
      return false;
    }

    await client.query(
      `UPDATE users SET password_hash = $1, must_change_password = false WHERE id = $2;`,
      [passwordHash, tokenResult.rows[0].user_id],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return true;
}

export async function validateResetToken(tokenHash: string): Promise<boolean> {
  const tokenResult = await pool.query(
    `SELECT * FROM password_reset_tokens WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()`,
    [tokenHash],
  );

  const isValid = tokenResult.rows.length > 0;

  return isValid;
}

export async function insertRefreshToken(
  userId: number,
  tokenHash: string,
): Promise<void> {
  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, NOW() + make_interval(days => $3) )`,
    [userId, tokenHash, Number(process.env.REFRESH_TOKEN_EXPIRATION)],
  );
}

export async function getRefreshTokenByHash(
  refreshTokenHash: string,
): Promise<refreshTokenModel | null> {
  const tokenResult = await pool.query<refreshTokenModel>(
    `SELECT * FROM refresh_tokens WHERE token_hash = $1 AND expires_at > NOW()`,
    [refreshTokenHash],
  );
  return tokenResult.rows[0] || null;
}

export async function deleteRefreshToken(
  refreshTokenHash: string,
): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM refresh_tokens WHERE token_hash = $1`,
    [refreshTokenHash],
  );
  return (result.rowCount ?? 0) > 0;
}

export async function deleteAllRefreshTokensForUser(
  userId: number,
): Promise<void> {
  await pool.query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [userId]);
}
