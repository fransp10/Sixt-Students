// a student with no shift requests and no shift assignments, so deleting them can't remove any shift history
export type DeletableStudent = {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  created_at: string;
};
