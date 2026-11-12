import { useParams } from "react-router-dom";
import ShiftHistoryMobileCard from "../ShiftHistoryMobileCard";
import ShiftHistoryTable from "../ShiftHistoryTable";
import { useGetUsersShiftsWorked } from "../../hooks/useGetUsersShiftAssignments";
import LoadingSpinner from "../LoadingSpinner";
import { useState } from "react";
import { SHIFT_HISTORY_PAGE_SIZE } from "../../helpers/constants";
import type { ShiftsWorkedHistoryData } from "../../types/Shift";
import Pagination from "../Pagination";
import type { TimeFrame } from "../../types/timeFrame";
import { getTimeFrameRange } from "../../helpers/getTimeFrameRange";
import { format } from "date-fns";

function ShiftHistoryPage() {
  const { userId } = useParams<{ userId: string }>();
  const [currentPageNumber, setPageNumber] = useState<number>(1);

  const [timeFrame, setTimeFrame] = useState<TimeFrame>("this-month");
  const { startDate, endDate } = getTimeFrameRange(timeFrame);

  const {
    data: shiftsWorkedHistoryData,
    isLoading,
    isError,
  } = useGetUsersShiftsWorked(
    userId!,
    // "all-time" has no start date, without dates the API returns every shift
    startDate ? format(startDate, "yyyy-MM-dd") : undefined,
    endDate ? format(endDate, "yyyy-MM-dd") : undefined,
  );

  let shiftsWorkedtoDisplay: ShiftsWorkedHistoryData[] = [];
  let totalPages = 0;

  if (!isLoading && !isError && shiftsWorkedHistoryData) {
    shiftsWorkedtoDisplay = shiftsWorkedHistoryData.slice(
      currentPageNumber * SHIFT_HISTORY_PAGE_SIZE - SHIFT_HISTORY_PAGE_SIZE,
      currentPageNumber * SHIFT_HISTORY_PAGE_SIZE,
    );

    totalPages = Math.ceil(
      shiftsWorkedHistoryData.length / SHIFT_HISTORY_PAGE_SIZE,
    );
  }

  const total = shiftsWorkedHistoryData?.length ?? 0;
  const first =
    total === 0 ? 0 : (currentPageNumber - 1) * SHIFT_HISTORY_PAGE_SIZE + 1;
  const last = Math.min(currentPageNumber * SHIFT_HISTORY_PAGE_SIZE, total);

  return (
    <div className="p-6 flex-col flex-1 min-h-0 gap-4 flex items-center justify-center  rounded-xl border border-borderDividers bg-cardBG">
      {isLoading && <LoadingSpinner size={96} />}
      {isError && (
        <div className="text-secondaryText">Error loading shift history.</div>
      )}
      {!isLoading && !isError && (
        <>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-primaryText">Shift history</h2>
              <p className="mt-1 text-sm text-secondaryText">
                Previously worked shifts
              </p>
            </div>
            <select
              value={timeFrame}
              onChange={(e) => {
                const selectedValue = e.target.value as TimeFrame;
                setTimeFrame(selectedValue);
                setPageNumber(1);
              }}
              className="w-full rounded-lg border border-borderDividers
          bg-cardBG px-3 py-2 text-sm text-primaryText
          outline-none focus:border-primary/40
          sm:w-auto"
            >
              <option value="this-month">This month</option>
              <option value="last-month">Last month</option>
              <option value="last-3-months">Last 3 months</option>
              <option value="this-year">This year</option>
              <option value="all-time">All time</option>
            </select>
          </div>

          <ShiftHistoryMobileCard
            timeFrame={timeFrame}
            shiftsWorkedHistoryData={shiftsWorkedtoDisplay}
          />
          <ShiftHistoryTable
            timeFrame={timeFrame}
            shiftsWorkedHistoryData={shiftsWorkedtoDisplay}
          />
        </>
      )}
      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div /> {/* empty left column */}
        <Pagination
          currentPageNumber={currentPageNumber}
          setPageNumber={setPageNumber}
          totalPages={totalPages}
        />
        <p className="justify-self-end text-sm text-secondaryText">
          {!isLoading && !isError && `Showing ${first}-${last} of ${total}`}
        </p>
      </div>
    </div>
  );
}

export default ShiftHistoryPage;
