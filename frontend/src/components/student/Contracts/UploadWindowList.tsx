import { eachMonthOfInterval, format, isSameMonth, parseISO } from "date-fns";
import { getContractUploadWindow } from "../../../helpers/contractUploadWindow";
import type { StudentContract } from "../../../types/studentContract";

type UploadWindowListProps = {
  contracts: StudentContract[];
  selectedMonth: Date;
  onSelect: (month: Date) => void;
};

function UploadWindowList({
  contracts,
  selectedMonth,
  onSelect,
}: UploadWindowListProps) {
  const { firstMonth, lastMonth } = getContractUploadWindow();
  const months = eachMonthOfInterval({ start: firstMonth, end: lastMonth });
  const currentMonth = new Date();

  const isUploaded = (month: Date) =>
    contracts.some((c) => isSameMonth(parseISO(c.contract_month), month));

  const uploadedCount = months.filter(isUploaded).length;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-borderDividers bg-cardBG p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-primaryText">
            Upload window
          </p>
          <p className="text-xs text-secondaryText">
            Last month to 3 months ahead
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-borderDividers bg-cardLighterBG px-2.5 py-0.5 text-xs text-secondaryText">
          {uploadedCount} / {months.length}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {months.map((month) => {
          const uploaded = isUploaded(month);
          const isSelected = isSameMonth(month, selectedMonth);

          return (
            <button
              key={month.toISOString()}
              type="button"
              onClick={() => onSelect(month)}
              className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left cursor-pointer transition-colors ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-borderDividers bg-cardLighterBG hover:border-primary/40"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-medium text-primaryText">
                {format(month, "MMMM yyyy")}
                {isSameMonth(month, currentMonth) && (
                  <span className="rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-success">
                    CURRENT MONTH
                  </span>
                )}
              </span>
              <span
                className={`flex items-center gap-1.5 text-xs font-semibold ${uploaded ? "text-success" : "text-warning"}`}
              >
                <span
                  className={`size-2 rounded-full ${uploaded ? "bg-success" : "bg-warning"}`}
                />
                {uploaded ? "Uploaded" : "Missing"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default UploadWindowList;
