export type Contract = {
  contract_id: string;
  user_id: string;
  contract_month: string;
  s3_key: string;
  uploaded_at: string;
  user_first_name: string;
  user_last_name: string;
  file_name: string;
  file_size: number;
};

export type ContractsWithoutSignedUrl = {
  id: number;
  contract_month: string; // YYYY-MM
  file_name: string;
  file_size: number; // bytes
  uploaded_at: string;
};

export type ContractWithUrl = Omit<Contract, "s3_key"> & {
  signed_url: string;
};
