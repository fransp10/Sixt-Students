export type UserMeType = {
  id: number;
  username: string;
  email: string | null;
  phone: string | null;
  user_role: UserRoles;
  default_hourly_rate: number;
  is_active: boolean;
  created_at: Date;
  date_of_birth: Date;
  first_name: string;
  last_name: string;
};

export type UserRoles = "admin" | "student";

export type SigninOption = "email" | "tempPassword";
export type CreateUserReqBodyType = {
  signin_option: SigninOption;
  user_role: UserRoles;
  first_name: string;
  last_name: string;
  date_of_birth: string; // "yyyy-MM-dd"
  default_hourly_rate?: number; // only required for students
  email?: string | null;
  phone?: string | null;
};
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

export type CreatedUser = UserWithoutPassword & {
  password?: string;
  emailSent?: boolean;
};
