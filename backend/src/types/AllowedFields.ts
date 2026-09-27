import { UserWithoutPassword } from "./User.js";

export type AllowedFields = keyof Omit<
  UserWithoutPassword,
  "id" | "created_at" | "username" | "is_active"
>;
