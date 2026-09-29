type ScheduleCalendarFooterProps = {
  onClose: () => void;
};
function ScheduleCalendarFooter({ onClose }: ScheduleCalendarFooterProps) {
  return (
    <div className="flex justify-end pt-6 mt-auto ">
      <button
        onClick={onClose}
        className="hover:cursor-pointer rounded-xl transition-all duration-200 w-36 border border-borderDividers bg-studentCard hover:bg-borderDividers px-6 py-3"
      >
        Cancel
      </button>
    </div>
  );
}

export default ScheduleCalendarFooter;
