function RaceDatePicker() {
  return (
    <>
      <label htmlFor="month" className="text-sm text-secondaryText">
        Month
      </label>
      <select
        id="month"
        className="h-10 w-52 cursor-pointer rounded-lg border border-borderDividers bg-cardBG px-3 text-sm text-primaryText outline-none scheme-dark  transition-colors hover:border-secondaryText focus:border-pending "
      >
        <option className="">October 2026</option>
      </select>
    </>
  );
}

export default RaceDatePicker;
