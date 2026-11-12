export type StudentAssigned = StudentRequesting & {
  actual_start_time: string | null;
  actual_end_time: string | null;
  no_show: boolean;
  // false when an admin assigned the student without a shift request
  has_request: boolean;
};

export type StudentRequesting = {
  id: number;
  first_name: string;
  last_name: string;
  requested_at: string;
  username: string;
};
