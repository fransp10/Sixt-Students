import { useState } from "react";
import PageHeading from "../components/PageHeading";
import StudentContractYearPicker from "../components/student/StudentContractYearPicker";
import EarningsPageTableRow from "../components/student/EarningsPageTableRow";

const dummyEarningsData = [
  {
    yearMonth: "January 2024",
    hours: 160,
    shifts: 20,
    hourlyRate: 15,
    earnings: 2400,
  },
  {
    yearMonth: "February 2024",
    hours: 140,
    shifts: 18,
    hourlyRate: 15,
    earnings: 2100,
  },
  {
    yearMonth: "March 2024",
    hours: 150,
    shifts: 19,
    hourlyRate: 15,
    earnings: 2250,
  },
];

function EarningsPage() {
  const dateStudentStartedWorking = new Date(2024, 0, 1);
  const yearStudentStartedWorking = dateStudentStartedWorking.getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(
    yearStudentStartedWorking,
  );
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);
  function handleClickMonth(month: string) {
    setExpandedMonths((prevExpandedMonths) => {
      if (prevExpandedMonths.includes(month)) {
        return prevExpandedMonths.filter((m) => m !== month);
      }
      return [...prevExpandedMonths, month];
    });
  }
  const earningsToDisplay = dummyEarningsData.filter((earning) => {
    return earning.yearMonth.split(" ")[1] === selectedYear.toString();
  });

  return (
    <div>
      <PageHeading
        heading="Earnings page"
        subheading="See details about your earnings"
      />
      <div className="mt-8 text-primaryText">
        <div className="flex justify-center">
          <StudentContractYearPicker
            firstYearToDisplay={yearStudentStartedWorking}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>
        <h1 className="text-xl font-bold">Earnings history</h1>
        <div className="w-full overflow-x-auto rounded-lg border border-borderDividers bg-cardBG p-4">
          <table className="w-full  border-collapse text-left text-sm">
            <thead className=" text-primaryText uppercase">
              <th className="px-4 py-2">Month</th>
              <th className="px-4 py-2">Hours</th>
              <th className="px-4 py-2">Shifts</th>
              <th className="px-4 py-2">Hourly rate</th>
              <th className="px-4 py-2">Earnings</th>
            </thead>
            <tbody>
              {earningsToDisplay.map((earning) => (
                <EarningsPageTableRow
                  key={earning.yearMonth}
                  handleClickMonth={handleClickMonth}
                  earning={earning}
                  isExpanded={expandedMonths.includes(earning.yearMonth)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EarningsPage;
