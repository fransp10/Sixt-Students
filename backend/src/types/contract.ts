export type Contract = {
  id: string;
  user_id: string;
  contract_month: string;
  s3_key: string;
  uploaded_at: string;
  user_first_name: string;
  user_last_name: string;
  file_name: string;
  file_size: number;
};

export type ContractMetadata = {
  id: string;
  contract_month: string; // YYYY-MM
  file_name: string;
  file_size: number; // bytes
  uploaded_at: string;
};

// one row per student for a month; contract fields are null when not uploaded
export type AdminContractRow = {
  user_id: number;
  user_first_name: string;
  user_last_name: string;
  user_email: string | null;
  contract_month: string; // YYYY-MM
  contract_id: number | null;
  uploaded_at: string | null;
  file_name: string | null;
  file_size: number | null;
};

// student ids grouped by what happened to their reminder
export type ContractReminderResult = {
  sent: string[];
  notFound: string[];
  noEmail: string[];
  failed: string[];
};

export type ContractWithUrl =Omit<Contract, "s3_key"> & {
  signed_url: string;
};
