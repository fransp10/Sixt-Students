import { format, parseISO } from "date-fns";
import InitialsIcon from "../../InitialsIcon";
import ContractStatusBadge from "./ContractStatusBadge";
import DownloadContractButton from "./DownloadContractButton";
import type { AdminContractRow } from "../../../types/adminContract";

function AdminContractsMobileCard({
  contract,
}: {
  contract: AdminContractRow;
}) {
  const fullName = `${contract.first_name} ${contract.last_name}`;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-borderDividers bg-studentCard p-3">
      <InitialsIcon name={fullName} size={36} className="text-xs" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-primaryText">
          {fullName}
        </p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <ContractStatusBadge isUploaded={!!contract.uploaded_at} />
          {contract.uploaded_at && (
            <span className="text-xs text-secondaryText">
              · {format(parseISO(contract.uploaded_at), "MMM d")}
            </span>
          )}
        </div>
      </div>

      {contract.uploaded_at && (
        <DownloadContractButton studentName={fullName} />
      )}
    </div>
  );
}

export default AdminContractsMobileCard;
