type ScheduleCalendarFooterProps = {
  onClose: () => void;
};
function ScheduleCalendarFooter({ onClose }: ScheduleCalendarFooterProps) {
  return (
    <div className=" shrink-0">
      <div className="mt-auto flex text-nowrap justify-end  gap-4 border-t border-borderDividers pt-4">
        <button
          onClick={onClose}
          className="hover:cursor-pointer rounded-xl transition-all duration-200 w-36 border border-borderDividers bg-studentCard hover:bg-borderDividers px-6 py-3"
        >
          Cancel
        </button>

        <button className="hover:cursor-pointer transition-all duration-300 hover:bg-primary/70 w-36 rounded-xl bg-primary px-6 py-3">
          Save changes
        </button>
      </div>
    </div>
  );
}

export default ScheduleCalendarFooter;
