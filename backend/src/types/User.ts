export type useRoleType = "admin" | "student";

export type UserWithPasswordType = {
  id: number;
  username: string;
  email: string | null;
  phone: string | null;
  password: string;
  user_role: useRoleType;
  default_hourly_rate: number;
  is_active: boolean;
  created_at: Date;
};

export type UserWithoutPasswordType = Omit<UserWithPasswordType, "password">;

export type CreateUserModelType = {
  username: string;
  email?: string | null;
  phone?: string | null;
  user_role: useRoleType;
  default_hourly_rate: number;
  password_hash: string;
};

export type CreateUserReqBodyType = Omit<CreateUserModelType, "password_hash">;
