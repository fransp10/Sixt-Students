import {
  ArrowDownTrayIcon,
  BookOpenIcon,
  DocumentTextIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { addMonths, format, isSameMonth, parseISO } from "date-fns";
import type { ContractMonth } from "../../../helpers/studentContractMonths";
import { isContractMonthUploadable } from "../../../helpers/contractUploadWindow";
import { CONTRACT_UPLOAD_MONTHS_AHEAD } from "../../../helpers/constants";
import { useOpenContractAdmin } from "../../../hooks/useOpenContractAdmin";
import SendReminderButton from "../AdminContracts/SendReminderButton";

const actionButtonClass =
  "flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-borderDividers px-3 text-sm text-primaryText cursor-pointer transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none";

function StatusLabel({ status }: { status: ContractMonth["status"] }) {
  const style = {
    uploaded: { dot: "bg-success", text: "text-success", label: "Uploaded" },
    missing: { dot: "bg-warning", text: "text-warning", label: "Not uploaded" },
    closed: {
      dot: "bg-icons",
      text: "text-secondaryText",
      label: "Not uploaded",
    },
    upcoming: {
      dot: "bg-darkBackground",
      text: "text-secondaryText",
      label: "Not due yet",
    },
  }[status];

  return (
    <span
      className={`flex items-center gap-1.5 text-xs font-semibold ${style.text}`}
    >
      <span className={`size-2 shrink-0 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}

function StudentContractRow({
  item,
  studentId,
  studentName,
}: {
  item: ContractMonth;
  studentId: number;
  studentName: string;
}) {
  const { mutate: openContract, isPending } = useOpenContractAdmin();
  const { month, status, contract } = item;
  const monthName = format(month, "MMMM");
  const isCurrentMonth = isSameMonth(month, new Date());

  return (
    <li
      className={`flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-6 ${isCurrentMonth ? "bg-primary/5" : ""} ${status === "upcoming" ? "opacity-70" : ""}`}
    >
      <div className="flex min-w-0 items-center gap-3 sm:w-52 sm:shrink-0 sm:flex-col sm:items-start sm:gap-1">
        <p
          className={`flex items-baseline gap-2 text-base font-semibold ${status === "upcoming" ? "text-secondaryText" : "text-primaryText"}`}
        >
          {monthName}
          {isCurrentMonth && (
            <span className="text-xs font-medium text-primary">This month</span>
          )}
        </p>
        <StatusLabel status={status} />
      </div>

      {/* FILE / HINT */}
      {status === "uploaded" && contract ? (
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-borderDividers">
            <DocumentTextIcon className="size-5 text-secondaryText" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-primaryText">
              {contract.file_name}
            </p>
            <p className="text-xs text-secondaryText">
              {(contract.file_size / 1024 / 1024).toFixed(1)} MB · Uploaded{" "}
              {format(parseISO(contract.uploaded_at), "MMM d, HH:mm")}
            </p>
          </div>
        </div>
      ) : status === "missing" ? (
        <p className="min-w-0 flex-1 text-sm text-secondaryText">
          {studentName.split(" ")[0]} can still upload this one.
        </p>
      ) : status === "closed" ? (
        <p className="flex min-w-0 flex-1 items-center gap-2 text-sm text-secondaryText">
          <LockClosedIcon className="size-4 shrink-0 text-icons" />
          Upload window closed
        </p>
      ) : (
        <p className="min-w-0 flex-1 text-sm text-icons">
          {isContractMonthUploadable(month)
            ? `${studentName.split(" ")[0]} can already upload this one.`
            : `Opens for upload in ${format(addMonths(month, -CONTRACT_UPLOAD_MONTHS_AHEAD), "MMMM")}.`}
        </p>
      )}

      {/* ACTIONS */}
      <div className="flex w-full gap-2 sm:w-auto sm:min-w-44 sm:justify-end">
        {status === "uploaded" && contract && (
          <>
            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                openContract({ contractId: contract.id, download: false })
              }
              className={actionButtonClass}
            >
              <BookOpenIcon className="size-4" />
              View
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                openContract({ contractId: contract.id, download: true })
              }
              className={actionButtonClass}
            >
              <ArrowDownTrayIcon className="size-4" />
              Download
            </button>
          </>
        )}
        {status === "missing" && (
          <div className="w-full sm:w-28">
            <SendReminderButton
              studentName={studentName}
              userId={studentId}
              month={format(month, "yyyy-MM")}
            />
          </div>
        )}
      </div>
    </li>
  );
}

export default StudentContractRow;
