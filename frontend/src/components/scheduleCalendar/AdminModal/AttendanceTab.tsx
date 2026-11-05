import { differenceInCalendarDays } from "date-fns";
import type { ShiftWithStudentsAndRequesters } from "../../../types/Shift";
import { ClockIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import AttendanceTabCard from "./AttendanceTabCard";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function AttendanceTab({ shift }: { shift: ShiftWithStudentsAndRequesters }) {
  const [listRef] = useAutoAnimate();
  const shiftDate = new Date(shift.date);
  const currentDate = new Date();
  const timeDifference = differenceInCalendarDays(shiftDate, currentDate);
  const timeString =
    timeDifference === 0
      ? "TODAY"
      : timeDifference + (timeDifference === 1 ? " day" : " days");
  const noShowStudents = shift.students_assigned.filter(
    (student) => student.no_show,
  );
  const showStudents = shift.students_assigned.filter(
    (student) => !student.no_show,
  );
  return (
    // below lg nothing clips or scrolls in here; the whole modal scrolls instead
    <div className="shrink-0 lg:shrink overflow-visible lg:overflow-hidden flex-1 flex flex-col  ">
      {shift.students_assigned.length > 0 && timeDifference >= 0 && (
        <div className="flex flex-row flex-wrap lg:flex-nowrap items-center gap-2 p-2 bg-pending/20 border border-pending/30  rounded-lg">
          <ClockIcon className="size-6 text-pending" />

          <p className="text-base">
            <span className="font-semibold">
              This shift starts {`${timeDifference > 0 ? "in " : " "}`}
            </span>
            <span className="font-semibold text-pending">{timeString}</span>.
          </p>
          <span>Everyone defaults to full shift. Manage attendance below.</span>
        </div>
      )}

      {shift.students_assigned.length === 0 && (
        <div className="flex-1 flex flex-col gap-2">
          <p className=" p-4 mt-4 bg-warning/20 border border-warning/30  rounded-lg">
            No students have been assigned to this shift yet. Once students are
            assigned, you can manage attendance here.
          </p>
          <div className="flex-1 flex items-center justify-center gap-2  p-4 border border-borderDividers rounded-lg bg-black/10">
            <LockClosedIcon className="size-24 text-secondaryText" />
          </div>
        </div>
      )}
      {shift.students_assigned.length > 0 && timeDifference < 0 && (
        <div className="flex flex-row flex-wrap lg:flex-nowrap items-center gap-2 p-2 bg-danger/20 border border-danger/30  rounded-lg">
          <ClockIcon className="size-6 text-danger" />
          <p className="text-base">
            <span className="font-semibold">This shift was scheduled </span>
            <span className="font-semibold text-danger">{`${Math.abs(timeDifference)} ${Math.abs(timeDifference) === 1 ? "day" : "days"} ago`}</span>
            .
          </p>
          <span>Manage attendance below.</span>
        </div>
      )}

      {shift.students_assigned.length > 0 && (
        <div className="flex flex-col gap-2 mt-4 p-3 lg:p-4 lg:min-h-108 lg:max-h-108  border border-borderDividers rounded-lg">
          <div className="flex flex-col gap-4 lg:flex-row  lg:gap-2">
            <div
              className={`flex flex-col gap-2 ${showStudents.length !== 0 ? "flex-1" : "hidden"} `}
            >
              <h2 className="font-semibold ">Showed up</h2>
              <ul
                ref={listRef}
                className="flex p-0 lg:p-2  flex-col gap-2 lg:max-h-96 overflow-y-auto scrollbar-thin  scrollbar-track-transparent scrollbar-thumb-borderDividers hover:scrollbar-thumb-borderDividers"
              >
                {showStudents.map((student) => (
                  <li key={student.id}>
                    <AttendanceTabCard student={student} shift={shift} />
                  </li>
                ))}
              </ul>
            </div>
            <div
              className={`flex flex-col gap-2 ${noShowStudents.length !== 0 ? "flex-1" : "hidden"}`}
            >
              {noShowStudents.length !== 0 && (
                <>
                  <h2 className="font-semibold text-danger">Didn't show up</h2>
                  <ul
                    ref={listRef}
                    className="flex p-0 lg:p-2 flex-1  flex-col gap-2 lg:max-h-96 overflow-y-auto scrollbar-thin  scrollbar-track-transparent scrollbar-thumb-borderDividers hover:scrollbar-thumb-borderDividers"
                  >
                    {noShowStudents.map((student) => (
                      <li key={student.id}>
                        <AttendanceTabCard student={student} shift={shift} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceTab;
