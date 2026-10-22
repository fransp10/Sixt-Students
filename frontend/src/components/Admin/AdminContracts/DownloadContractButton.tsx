import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

function DownloadContractButton({ studentName }: { studentName: string }) {
  return (
    <button
      type="button"
      aria-label={`Download ${studentName}'s contract`}
      className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-borderDividers text-primaryText cursor-pointer transition-colors hover:border-primary hover:text-primary"
    >
      <ArrowDownTrayIcon className="size-5" />
    </button>
  );
}

export default DownloadContractButton;
