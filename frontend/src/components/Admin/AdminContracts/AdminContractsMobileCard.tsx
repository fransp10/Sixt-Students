import { format, parseISO } from "date-fns";
import InitialsIcon from "../../InitialsIcon";
import ContractStatusBadge from "./ContractStatusBadge";
import ContractActionButton from "./DownloadContractButton";
import SendReminderButton from "./SendReminderButton";
import type { Contract } from "../../../types/contracts";

function AdminContractsMobileCard({
  contract,
  selectedMonth,
}: {
  contract: Contract;
  selectedMonth: string;
}) {
  const fullName = `${contract.user_first_name} ${contract.user_last_name}`;

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

      {contract.uploaded_at ? (
        <div className="flex gap-2">
          <ContractActionButton
            download={false}
            studentName={fullName}
            contractId={Number(contract.contract_id)}
          />
          <ContractActionButton
            download={true}
            studentName={fullName}
            contractId={Number(contract.contract_id)}
          />
        </div>
      ) : (
        <SendReminderButton
          studentName={fullName}
          userId={Number(contract.user_id)}
          month={selectedMonth}
        />
      )}
    </div>
  );
}

export default AdminContractsMobileCard;
