import type { ContractFilter } from "../../../types/adminContract";

type ContractsFilterTabsProps = {
  filter: ContractFilter;
  onChange: (filter: ContractFilter) => void;
  counts: Record<ContractFilter, number>;
};

const tabs: { value: ContractFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "missing", label: "Missing" },
  { value: "uploaded", label: "Uploaded" },
];

function ContractsFilterTabs({
  filter,
  onChange,
  counts,
}: ContractsFilterTabsProps) {
  return (
    <div className="flex w-full gap-1 md:w-auto">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`h-9 flex-1 rounded-lg border px-3 text-sm cursor-pointer transition-colors md:flex-none ${
            filter === tab.value
              ? "border-borderDividers bg-cardLighterBG text-primaryText"
              : "border-transparent text-secondaryText hover:text-primaryText"
          }`}
        >
          {tab.label} <span className="text-icons">{counts[tab.value]}</span>
        </button>
      ))}
    </div>
  );
}

export default ContractsFilterTabs;
