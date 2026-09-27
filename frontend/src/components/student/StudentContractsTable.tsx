import { ArrowUpTrayIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import UploadContractModal from "./UploadContractModal";
import { useState } from "react";

type StudentContractsTableProps = {
  monthsToDispaly: Date[];
};

function StudentContractsTable({
  monthsToDispaly,
}: StudentContractsTableProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  return (
    <div className="overflow-hidden rounded-xl border border-borderDividers bg-cardBG">
      <table className="w-full">
        <thead className="bg-headersCalendar">
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-secondaryText">
            <th className="px-5 py-3">Month</th>
            <th className="px-5 py-3">Contracts</th>
            <th className="px-5 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-borderDividers">
          {monthsToDispaly.map((month) => (
            <tr
              key={month.toISOString()}
              className="transition-colors hover:bg-white/2"
            >
              <td className="px-5 py-4">
                <div>
                  <p className="font-medium text-primaryText">
                    {format(month, "MMMM")}
                  </p>
                  <p className="mt-0.5 text-sm text-secondaryText">
                    {format(month, "yyyy")}
                  </p>
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-3 text-secondaryText">
                  <DocumentTextIcon className="size-5" />

                  <span className="text-sm">No contract uploaded</span>
                </div>
              </td>
              <td className="mt-0.5 text-sm text-secondaryText">
                <div className="flex justify-end mr-6">
                  <button
                    onClick={() => {
                      setIsUploadModalOpen(true);
                      setSelectedMonth(month);
                    }}
                    className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
                  >
                    <ArrowUpTrayIcon className="size-4" />
                    Upload
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isUploadModalOpen && (
        <UploadContractModal
          month={selectedMonth}
          onClose={() => setIsUploadModalOpen(false)}
        />
      )}
    </div>
  );
}

export default StudentContractsTable;
