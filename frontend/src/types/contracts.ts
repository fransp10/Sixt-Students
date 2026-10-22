export type Contract = {
  id: string;
  user_id: string;
  month: string;
  uploaded_at: string;
  signed_url: string;
  file_name: string;
  file_size: number; // bytes
};

export type ContractsWithoutSignedUrl = {
  id: number;
  contract_month: string; // YYYY-MM
  file_name: string;
  file_size: number; // bytes
  uploaded_at: string;
};
