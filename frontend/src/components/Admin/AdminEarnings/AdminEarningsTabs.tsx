import { BanknotesIcon, TrophyIcon } from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

export type EarningsTab = "payroll" | "race";
type EarningsTabProps = {
  value: EarningsTab;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

type AdminEarningsTabsProps = {
  tab: EarningsTab;
  onChange: (tab: EarningsTab) => void;
};

const tabs: EarningsTabProps[] = [
  { value: "payroll", label: "Payroll", Icon: BanknotesIcon },
  { value: "race", label: "Race", Icon: TrophyIcon },
];

function AdminEarningsTabs({ tab, onChange }: AdminEarningsTabsProps) {
  return (
    <div className="mt-8 flex gap-6 border-b border-borderDividers">
      {tabs.map(({ value, label, Icon }) => {
        const isActive = tab === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            id={`tab-${value}`}
            onClick={() => onChange(value)}
            className={`flex items-center gap-2 border-b-2 px-1 pb-3 text-base font-semibold cursor-pointer transition-colors ${
              isActive
                ? "border-primary text-primaryText"
                : "border-transparent text-secondaryText hover:text-primaryText"
            }`}
          >
            <Icon className={`size-5 ${isActive ? "text-primary" : ""}`} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default AdminEarningsTabs;
