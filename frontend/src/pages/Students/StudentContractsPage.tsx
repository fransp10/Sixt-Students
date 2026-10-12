import {
  addMonths,
  eachMonthOfInterval,
  endOfYear,
  startOfMonth,
} from "date-fns";
import StudentContractsTable from "../../components/student/StudentContractsTable";
import { useState } from "react";
import StudentContractYearPicker from "../../components/student/StudentContractYearPicker";
import PageHeading from "../../components/PageHeading";

function StudentContractsPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  const currentDate = new Date();
  const dateStudentStartedWork = new Date(2024, 2, 22); // January 1, 2024
  const lastMonthOfSelectedYear = endOfYear(new Date(selectedYear, 0, 1));

  const startDate =
    selectedYear === dateStudentStartedWork.getFullYear()
      ? startOfMonth(dateStudentStartedWork)
      : new Date(selectedYear, 0, 1);

  const endDate =
    selectedYear === currentYear
      ? startOfMonth(addMonths(currentDate, 2))
      : lastMonthOfSelectedYear;

  const monthsToDisplay = eachMonthOfInterval({
    start: startDate,
    end: endDate,
  }).reverse();

  function onYearChange(year: number) {
    setSelectedYear(year);
  }

  return (
    <div>
      <PageHeading
        heading="Contracts"
        subheading="Upload and manage your monthly work contracts."
      />
      {/* Date picker */}
      <StudentContractYearPicker
        selectedYear={selectedYear}
        onYearChange={onYearChange}
        firstYearToDisplay={dateStudentStartedWork.getFullYear()}
      />
      <div className=" text-primaryText w-full h-full">
        <StudentContractsTable monthsToDispaly={monthsToDisplay} />
      </div>
    </div>
  );
}

export default StudentContractsPage;
