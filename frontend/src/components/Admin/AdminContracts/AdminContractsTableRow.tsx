import { format, parseISO } from "date-fns";
import InitialsIcon from "../../InitialsIcon";
import ContractStatusBadge from "./ContractStatusBadge";
import DownloadContractButton from "./DownloadContractButton";
import type { Contract } from "../../../types/contracts";

function AdminContractsTableRow({ contract }: { contract: Contract }) {
  const fullName = `${contract.user_first_name} ${contract.user_last_name}`;

  return (
    <tr className="border-b border-borderDividers last:border-0">
      <td className="py-2.5 pr-4">
        <div className="flex items-center gap-3 min-w-0">
          <InitialsIcon name={fullName} size={36} className="text-xs" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-primaryText">
              {fullName}
            </p>
            <p className="truncate text-xs text-secondaryText">
              {contract.user_email ?? "No email"}
            </p>
          </div>
        </div>
      </td>
      <td className="py-2.5 pr-4">
        <ContractStatusBadge isUploaded={!!contract.uploaded_at} />
      </td>
      <td className="py-2.5 pr-4 text-secondaryText">
        {contract.uploaded_at
          ? format(parseISO(contract.uploaded_at), "MMM d, HH:mm")
          : "—"}
      </td>
      <td className="py-2.5">
        <div className="flex justify-end">
          {contract.uploaded_at && (
            <DownloadContractButton studentName={fullName} />
          )}
        </div>
      </td>
    </tr>
  );
}

export default AdminContractsTableRow;
