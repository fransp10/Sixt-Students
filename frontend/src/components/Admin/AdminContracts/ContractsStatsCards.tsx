import {
  ClockIcon,
  DocumentCheckIcon,
  DocumentMinusIcon,
} from "@heroicons/react/24/outline";
import ContractStatsCard from "./ContractStatsCard";

const uploaded = 4;
const totalStudents = 6;
const missing = totalStudents - uploaded;

function ContractsStatsCards() {
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
        value="Oct 21"
        caption="October 2026"
        className="col-span-2 md:col-span-1"
      />
    </div>
  );
}

export default ContractsStatsCards;
