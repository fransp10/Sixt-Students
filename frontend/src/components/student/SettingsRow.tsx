import type { ReactNode } from "react";

type SettingsRowProps = {
  label: string;
  description: string;
  value: ReactNode;
  action: ReactNode;
};

// label + description on the left, the current value in the middle, the action on the right
function SettingsRow({ label, description, value, action }: SettingsRowProps) {
  return (
    <div className="flex items-center gap-4 py-4 last:pb-0">
      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:gap-6">
        <div className="sm:w-52 sm:shrink-0">
          <p className="text-sm font-semibold text-primaryText">{label}</p>
          <p className="hidden text-xs text-secondaryText sm:block">
            {description}
          </p>
        </div>
        <div className="mt-0.5 flex min-w-0 items-center gap-3 sm:mt-0">
          {value}
        </div>
      </div>
      {action}
    </div>
  );
}

export default SettingsRow;
