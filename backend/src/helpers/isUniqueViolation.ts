import { DatabaseError } from "pg";

export function isUniqueViolation(error: unknown, constraint: string) {
  return (
    error instanceof DatabaseError &&
    error.code === "23505" &&
    error.constraint === constraint
  );
}
