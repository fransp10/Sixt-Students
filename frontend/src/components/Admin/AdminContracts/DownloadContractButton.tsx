import { ArrowDownTrayIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { useOpenContractAdmin } from "../../../hooks/useOpenContractAdmin";

function ContractActionButton({
  studentName,
  download,
  contractId,
}: {
  studentName: string;
  download: boolean;
  contractId: number;
}) {
  const { mutate: openContract } = useOpenContractAdmin();
  return (
    <button
      type="button"
      onClick={() => openContract({ contractId, download })}
      aria-label={`Download ${studentName}'s contract`}
      className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-borderDividers text-primaryText cursor-pointer transition-colors hover:border-primary hover:text-primary w-full "
    >
      {download ? (
        <ArrowDownTrayIcon className="size-5" />
      ) : (
        <BookOpenIcon className="size-5" />
      )}
    </button>
  );
}

export default ContractActionButton;
