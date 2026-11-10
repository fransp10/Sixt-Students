// what GET /admin/payroll?month=YYYY-MM returns, keep in sync with backend/src/types/payroll.ts
export type PayrollStatus =
  | "in_progress" // the month hasn't ended yet
  | "waiting_on_contracts" // ended, but someone who worked has no contract
  | "ready" // ended and every contract is in
  | "paid";

export type PayrollRow = {
  user_id: number;
  first_name: string;
  last_name: string;
  hours: number;
  amount: number;
  has_contract: boolean;
};

export type Payroll = {
  month: string; // YYYY-MM
  status: PayrollStatus;
  rows: PayrollRow[];
  scheduled: { amount: number; shifts: number }; // approved shifts still to come, 0 for past months
  budget: number | null; // null until the admin sets one
  payment: { paid_at: string; paid_amount: number } | null;
};
