export type SchedulePageCalendarProps = {
  selectedDate: Date;
  onSwitchDate: (newDate: Date) => void;
  handleShiftClick: (shiftId: number | null) => void;
};
