export type Contract = {
  id: string;
  user_id: string;
  month: string;
  s3_key: string;
  created_at: string;
  user_first_name: string;
  user_last_name: string;
};

export type ContractWithUrl = Omit<
  Contract,
  "s3_key" | "user_first_name" | "user_last_name"
> & {
  signedUrl: string;
};
