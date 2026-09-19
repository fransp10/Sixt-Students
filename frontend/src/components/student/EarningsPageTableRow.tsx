type EarningsPageTableRowProps = {
  earning: {
    yearMonth: string;
    hours: number;
    shifts: number;
    hourlyRate: number;
    earnings: number;
  };
  handleClickMonth: (month: string) => void;
  isExpanded: boolean;
};

function EarningsPageTableRow({
  earning,
  handleClickMonth,
  isExpanded,
}: EarningsPageTableRowProps) {
  return (
    <>
      <tr
        onClick={() => handleClickMonth(earning.yearMonth)}
        className="border-t hover:bg-headersCalendar cursor-pointer border-borderDividers"
      >
        <td className="px-4 py-2">{earning.yearMonth}</td>
        <td className="px-4 py-2">{earning.hours}</td>
        <td className="px-4 py-2">{earning.shifts}</td>
        <td className="px-4 py-2">${earning.hourlyRate}</td>
        <td className="px-4 py-2">${earning.earnings}</td>
      </tr>
      {/* Expanded view */}
      <tr>
        <td colSpan={5}>
          <div
            className={`grid transition-all duration-200 ease-in-out ${
              isExpanded
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0 "
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-4 py-4">
                <p>Additional details for {earning.yearMonth}</p>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

export default EarningsPageTableRow;
