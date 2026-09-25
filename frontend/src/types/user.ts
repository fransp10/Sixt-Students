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
