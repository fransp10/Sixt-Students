import { useParams } from "react-router-dom";
import { fakeStudents, getFullName } from "../../helpers/helpers";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { eachMonthOfInterval } from "date-fns";
import { format } from "date-fns";
import ContractsTable from "./ContractsTable";

function AdminChosenStudentContractsPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const studentId = useParams().studentId;
  const startYear = 2024;
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index,
  );
  const student = fakeStudents.find((student) => student.id === studentId);

  const tableRowMonths = eachMonthOfInterval({
    start: new Date(selectedYear, 0, 1),
    end: new Date(selectedYear, 11, 31),
  }).map((month) => format(month, "MMMM yyyy"));
  tableRowMonths.reverse(); // Reverse the array to display months in descending order

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between bg-cardLighterBG p-4 rounded-lg border border-borderDividers">
        {/* HEADER */}
        <div className="flex flex-row items-center gap-4 h-full">
          <div className=" shrink-0 flex items-center justify-center size-16 rounded-full bg-borderDividers">
            <ClipboardDocumentIcon className="size-8 text-icons" />
          </div>
          <div className="flex flex-col items-start">
            <p className="text-xl font-bold">Contracts</p>
            <p className="text-base text-secondaryText">
              View and manage {getFullName(student)}'s contracts
            </p>
          </div>
        </div>
        {/* Year picker */}
        <div className="flex flex-row items-center gap-2 ">
          <button
            disabled={selectedYear === years[0]}
            className="size-10 p-4 border border-borderDividers rounded-lg flex items-center justify-center hover:bg-borderDividers transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={() => setSelectedYear(selectedYear - 1)}
          >
            <ChevronLeftIcon className="size-5 shrink-0 text-icons" />
          </button>

          <select
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            value={selectedYear}
            className="h-10 rounded-lg border border-borderDividers bg-cardBG px-4 text-sm text-primaryText outline-none focus:border-secondaryText"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <button
            className="size-10 p-4 border border-borderDividers rounded-lg flex items-center justify-center hover:bg-borderDividers transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={() => setSelectedYear(selectedYear + 1)}
            disabled={selectedYear === years[years.length - 1]}
          >
            <ChevronRightIcon className=" shrink-0 size-5 text-icons" />
          </button>
        </div>
      </div>
      {/* TABLE */}
      <ContractsTable tableRowMonths={tableRowMonths} />
    </div>
  );
}

export default AdminChosenStudentContractsPage;
