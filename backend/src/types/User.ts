export type UserRoles = "admin" | "student";

export type UserWithPassword = {
  id: number;
  username: string;
  email: string | null;
  phone: string | null;
  password: string;
  user_role: UserRoles;
  default_hourly_rate: number;
  is_active: boolean;
  created_at: Date;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  must_change_password?: boolean;
};

export type UserWithoutPassword = Omit<UserWithPassword, "password">;

export type CreateUserModel = {
  username: string;
  email?: string | null;
  phone?: string | null;
  user_role: UserRoles;
  default_hourly_rate: number;
  password_hash: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
};

export type CreateUserReqBodyType = Omit<CreateUserModel, "password_hash">;
export type UserWithHashedPasswordType = Omit<UserWithPassword, "password"> & {
  password_hash: string;
};
