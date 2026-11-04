export type StudentRequesting = {
  id: number;
  first_name: string;
  last_name: string;
  requested_at: string;
  username: string;
};

export type StudentAssigned = StudentRequesting & {
  actual_start_time: string | null;
  actual_end_time: string | null;
  // false when an admin assigned the student without a shift request
  has_request: boolean;
};

export type deletableStudent = {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  created_at: string;
};

export type StudentMisingContract = {
  id: number;
  email: string | null;
  first_name: string;
};
