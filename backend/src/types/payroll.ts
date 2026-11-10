// keep in sync with frontend/src/types/payroll.ts
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

// approved shifts from today to the end of the month, 0 for past months
export type PayrollScheduled = {
  amount: number;
  shifts: number;
};

export type PayrollPayment = {
  paid_at: string;
  paid_amount: number; // snapshot of the total when it was marked paid
};

// GET /admin/payroll?month=YYYY-MM
export type Payroll = {
  month: string; // YYYY-MM
  status: PayrollStatus;
  rows: PayrollRow[];
  scheduled: PayrollScheduled;
  budget: number | null; // null until the admin sets one
};

// payroll_payments table
export type PayrollPaymentRow = PayrollPayment & {
  month: string; // first day of the month
  paid_by_admin_id: number | null; // null once that admin is deleted
};
