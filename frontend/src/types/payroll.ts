// what GET /admin/payroll?month=YYYY-MM returns, keep in sync with backend/src/types/payroll.ts
export type PayrollStatus =
  | "in_progress" // the month hasn't ended yet
  | "nothing_to_pay" // ended, but nobody who worked has a contract
  | "ready" // ended, students with a contract are waiting to be paid
  | "paid" // every student with a contract is paid
  | "partly_paid"; // some students with a contract are paid, others not yet

// one row per student who worked in the month (hours > 0)
export type PayrollRow = {
  user_id: number;
  first_name: string;
  last_name: string;
  hours: number;
  amount: number; // earned, but only paid when has_contract is true
  has_contract: boolean;
  paid_at: string | null; // null if not paid yet
  paid_amount: number | null; // null if not paid yet
};

export type Payroll = {
  month: string; // YYYY-MM
  status: PayrollStatus;
  rows: PayrollRow[];
  scheduled: { amount: number; shifts: number }; // approved shifts still to come, 0 for past months
  budget: number | null; // null until the admin sets one
};
