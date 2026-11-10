import type { PayrollRow } from "../types/payroll";

// builds the CSV in the browser, so it always matches what the table shows
export function exportPayrollCsv(month: string, rows: PayrollRow[]) {
  // students without a contract are listed but not paid, so they stay out of the totals
  const payable = rows.filter((row) => row.has_contract);
  const totalHours = payable.reduce((sum, row) => sum + row.hours, 0);
  const totalAmount = payable.reduce((sum, row) => sum + row.amount, 0);

  const lines = [
    ["Student", "Hours", "Hourly rate (EUR)", "Amount (EUR)", "Contract"],
    ...rows.map((row) => [
      `${row.first_name} ${row.last_name}`,
      row.hours,
      (row.amount / row.hours).toFixed(2),
      row.amount.toFixed(2),
      row.has_contract ? "Uploaded" : "Missing",
    ]),
    ["Total with contract", totalHours, "", totalAmount.toFixed(2), ""],
  ];

  const csv = lines
    .map((line) =>
      line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
    )
    .join("\r\n");

  // BOM so Excel reads č, ć and š correctly
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `payroll-${month}.csv`;
  link.click();
  // give the browser a moment to start the download before freeing the file
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
