type RaceModePickerProps = {
  handleChangeMode: (mode: "hours" | "shifts") => void;
  mode: "hours" | "shifts";
};

function RaceModePicker({ handleChangeMode, mode }: RaceModePickerProps) {
  return (
    <div className="flex flex-row gap-2 bg-cardBG p-2 border-borderDividers border rounded-lg">
      <button
        onClick={() => handleChangeMode("hours")}
        className={`${mode === "hours" ? "bg-icons text-primaryText " : "text-secondaryText bg-cardBG "} px-4 py-2 rounded-lg font-bold transition-colors duration-300 cursor-pointer `}
      >
        Hours
      </button>
      <button
        onClick={() => handleChangeMode("shifts")}
        className={`${mode === "shifts" ? "bg-icons text-primaryText " : "text-secondaryText bg-cardBG "} px-4 py-2 rounded-lg font-bold cursor-pointer `}
      >
        Shifts
      </button>
    </div>
  );
}

export default RaceModePicker;
