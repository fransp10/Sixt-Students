import {
  ClockIcon,
  DocumentCheckIcon,
  DocumentMinusIcon,
} from "@heroicons/react/24/outline";
import ContractStatsCard from "./ContractStatsCard";

type ContractsStatsCardsProps = {
  uploaded: number;
  totalStudents: number;
  missing: number;
  lastUpload: string | null;
};

function ContractsStatsCards({
  uploaded,
  totalStudents,
  missing,
  lastUpload,
}: ContractsStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      <ContractStatsCard
        title="Uploaded"
        icon={DocumentCheckIcon}
        value={uploaded}
        total={totalStudents}
        progress={(uploaded / totalStudents) * 100}
      />
      <ContractStatsCard
        title="Missing"
        icon={DocumentMinusIcon}
        value={missing}
        valueClassName={missing > 0 ? "text-warning" : "text-primaryText"}
        caption={missing > 0 ? "Students still to upload" : "Everyone uploaded"}
      />
      <ContractStatsCard
        title="Last upload"
        icon={ClockIcon}
        value={lastUpload ?? "N/A"}
        caption="October 2026"
        className="col-span-2 md:col-span-1"
      />
    </div>
  );
}

export default ContractsStatsCards;
