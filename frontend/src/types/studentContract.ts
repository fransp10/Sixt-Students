export type StudentContract = {
  id: number;
  contract_month: string; // first day of the month, e.g. "2026-10-01"
  file_name: string;
  file_size: number; // bytes
  uploaded_at: string;
};
