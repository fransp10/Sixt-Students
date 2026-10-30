import {
  ArchiveBoxArrowDownIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

type ActionButtonsForTableProps = {
  numOfContractsMissing: number;
  uploadedCount: number;
  remindMissing: (args: { month: string }) => void;
  selectedMonth: string;
  isPendingReminders: boolean;
  isRemindersSent: boolean;
};

function ActionButtonsForTable({
  numOfContractsMissing,
  uploadedCount,
  remindMissing,
  selectedMonth,
  isPendingReminders,
  isRemindersSent,
}: ActionButtonsForTableProps) {
  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={
            numOfContractsMissing === 0 || isPendingReminders || isRemindersSent
          }
          onClick={() => remindMissing({ month: selectedMonth })}
          className="flex min-h-9 items-center justify-center gap-2 rounded-lg border border-borderDividers px-3 text-sm font-semibold text-primaryText cursor-pointer hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <EnvelopeIcon className="size-5" />
          {isRemindersSent
            ? "Reminders sent"
            : isPendingReminders
              ? "Sending..."
              : `Remind missing (${numOfContractsMissing})`}
        </button>
        <button
          type="button"
          disabled={uploadedCount === 0}
          className="flex min-h-9 items-center justify-center gap-2 rounded-lg border border-borderDividers px-3 text-sm font-semibold text-primaryText cursor-pointer hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArchiveBoxArrowDownIcon className="size-5" />
          Download all ({uploadedCount})
        </button>
      </div>
    </div>
  );
}

export default ActionButtonsForTable;
