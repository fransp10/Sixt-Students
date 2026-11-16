import jwt from "jsonwebtoken";

export function signAccessToken(userId: number): string {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRATION) * 60,
  });
}
