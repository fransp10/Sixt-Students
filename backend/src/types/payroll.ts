// keep in sync with frontend/src/types/payroll.ts
export type PayrollStatus =
  | "in_progress" // the month hasn't ended yet
  | "waiting_on_contracts" // ended, but someone who worked has no contract
  | "ready" // ended and every contract is in
  | "paid";

// one row per student who worked in the month (hours > 0)
export type PayrollRow = {
  user_id: number;
  first_name: string;
  last_name: string;
  hours: number;
  amount: number;
  has_contract: boolean;
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
  payment: PayrollPayment | null;
};

// payroll_payments table
export type PayrollPaymentRow = PayrollPayment & {
  month: string; // first day of the month
  paid_by_admin_id: number | null; // null once that admin is deleted
};
