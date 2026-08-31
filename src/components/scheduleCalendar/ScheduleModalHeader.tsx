import { CalendarIcon } from "@heroicons/react/24/outline";

function ScheduleModalHeader({
  formatedDate,
  shiftTime,
  shiftType,
}: {
  formatedDate: string;
  shiftTime: string;
  shiftType: "Morning" | "Middle" | "Afternoon";
}) {
  return (
    <div className="flex gap-4 items-center mb-4 ">
      <CalendarIcon className="h-18 w-18 p-4 rounded-full text-primary bg-primary/20 " />
      <div className="flex flex-col gap-1">
        <div className="flex gap-2 items-center">
          <p className="text-3xl font-semibold">{shiftType} Shift</p>
          <p className="text-xs">●</p>
          <p className="text-xl text-secondaryText">{formatedDate}</p>
        </div>
        <p className="text-secondaryText text-xl">{shiftTime}</p>
      </div>
    </div>
  );
}

export default ScheduleModalHeader;
