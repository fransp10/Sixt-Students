export type AdminContractRow = {
  student_id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  contract_id: number | null; // null when the student hasn't uploaded
  uploaded_at: string | null;
};

export type ContractFilter = "all" | "missing" | "uploaded";
