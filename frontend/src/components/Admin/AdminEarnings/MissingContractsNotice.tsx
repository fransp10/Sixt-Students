import { format, parseISO } from "date-fns";
import {
  CheckIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useSendContractReminders } from "../../../hooks/useSendContractReminders";
import type { Payroll, PayrollRow } from "../../../types/payroll";

// en-GB leaves out the comma before "and"
const listFormat = new Intl.ListFormat("en-GB", { type: "conjunction" });

// "Ana and Ivan", "Ana, Ivan and Sara", "Ana, Ivan and 3 others"
function listNames(students: PayrollRow[]) {
  const names = students.map((s) => `${s.first_name} ${s.last_name}`);
  if (names.length <= 3) return listFormat.format(names);
  return listFormat.format([...names.slice(0, 2), `${names.length - 2} others`]);
}

function MissingContractsNotice({
  payroll,
  missing,
}: {
  payroll: Payroll;
  missing: PayrollRow[];
}) {
  const {
    mutate: sendReminders,
    isPending,
    isSuccess,
    isError,
  } = useSendContractReminders();

  if (missing.length === 0 || payroll.status === "paid") return null;

  const count = missing.length;
  const monthName = format(parseISO(payroll.month), "MMMM");
  const buttonLabel =
    count === 1 ? "Remind them" : count === 2 ? "Remind both" : `Remind all ${count}`;

  return (
    <div className="mt-5 flex flex-col gap-3 rounded-lg border border-borderDividers bg-cardLighterBG p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <ExclamationTriangleIcon className="mt-0.5 size-5 shrink-0 text-warning" />
        <p className="text-sm text-secondaryText">
          <span className="font-semibold text-primaryText">
            {count} {count === 1 ? "contract" : "contracts"} missing.
          </span>{" "}
          {listNames(missing)} {count === 1 ? "hasn't" : "haven't"} uploaded
          their {monthName} contract yet.
          {payroll.status !== "in_progress" && " Remind them before you pay."}
          {isError && (
            <span className="block text-danger">
              Couldn't send the reminders. Try again.
            </span>
          )}
        </p>
      </div>

      {isSuccess ? (
        <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-secondaryText">
          <CheckIcon className="size-4 text-success" />
          Reminders sent
        </span>
      ) : (
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            sendReminders({
              month: payroll.month,
              userIds: missing.map((s) => s.user_id),
            })
          }
          className="flex h-9 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-borderDividers px-3 text-sm font-semibold text-primaryText cursor-pointer transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <EnvelopeIcon className="size-4" />
          {isPending ? "Sending..." : buttonLabel}
        </button>
      )}
    </div>
  );
}

export default MissingContractsNotice;
