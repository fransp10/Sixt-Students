import { format, parseISO } from "date-fns";
import InitialsIcon from "../../InitialsIcon";
import ContractStatusBadge from "./ContractStatusBadge";
import type { Contract } from "../../../types/contracts";
import ContractActionButton from "./DownloadContractButton";
import SendReminderButton from "./SendReminderButton";

function AdminContractsTableRow({
  contract,
  selectedMonth,
}: {
  contract: Contract;
  selectedMonth: string;
}) {
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
      {contract.uploaded_at ? (
        <>
          <td className="py-2.5">
            <div className="flex justify-center mr-2">
              <ContractActionButton
                download={false}
                studentName={fullName}
                contractId={Number(contract.contract_id)}
              />
            </div>
          </td>
          <td className="py-2.5 ">
            <div className="flex  justify-center ml-2">
              <ContractActionButton
                download={true}
                studentName={fullName}
                contractId={Number(contract.contract_id)}
              />
            </div>
          </td>
        </>
      ) : (
        // no contract to view or download, so the reminder takes both cells
        <td colSpan={2} className="py-2.5">
          <div className="flex justify-center">
            <SendReminderButton
              studentName={fullName}
              userId={Number(contract.user_id)}
              month={selectedMonth}
            />
          </div>
        </td>
      )}
    </tr>
  );
}

export default AdminContractsTableRow;
