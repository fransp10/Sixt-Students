import { CheckIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { useSendContractReminders } from "../../../hooks/useSendContractReminders";

function SendReminderButton({
  studentName,
  userId,
  month,
}: {
  studentName: string;
  userId: number;
  month: string;
}) {
  const {
    mutate: sendReminders,
    isPending,
    isSuccess,
  } = useSendContractReminders();

  return (
    <button
      type="button"
      disabled={isPending || isSuccess}
      onClick={() => sendReminders({ month, userIds: [userId] })}
      aria-label={`Send ${studentName} a contract reminder`}
      className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-borderDividers px-3 text-xs font-semibold text-primaryText cursor-pointer transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 w-full"
    >
      {isSuccess ? (
        <CheckIcon className="size-4 text-success" />
      ) : (
        <EnvelopeIcon className="size-4" />
      )}
      {isSuccess ? "Sent" : isPending ? "Sending..." : "Remind"}
    </button>
  );
}

export default SendReminderButton;
