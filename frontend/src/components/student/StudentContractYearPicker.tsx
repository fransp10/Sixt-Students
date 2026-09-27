type StudentContractYearPickerProps = {
  selectedYear: number;
  onYearChange: (year: number) => void;
  firstYearToDisplay: number;
};

function StudentContractYearPicker({
  selectedYear,
  onYearChange,
  firstYearToDisplay,
}: StudentContractYearPickerProps) {
  const currentYear = new Date().getFullYear();
  const length = currentYear - firstYearToDisplay + 1;

  const yearsToDisplay = Array.from(
    {
      length,
    },
    (_, index) => currentYear - index,
  );
  return (
    <div className="flex text-primaryText font-semibold mb-4 justify-end">
      <select
        onChange={(e) => onYearChange(Number(e.target.value))}
        value={selectedYear}
        className="rounded-lg border border-borderDividers bg-cardBG px-3 py-2 text-sm text-primaryText focus:outline-none   focus:border-surfaceCards"
      >
        {yearsToDisplay.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

export default StudentContractYearPicker;
