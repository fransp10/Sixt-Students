import { format, subYears } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { MINIMUM_STUDENT_AGE } from "../../../helpers/constants";
type CreateStudentDateInput = {
  label: string;
  value?: Date;
  onChange: (date: Date) => void;
};
function CreateStudentDateInput({
  label,
  value,
  onChange,
}: CreateStudentDateInput) {
  const [isOpen, setIsOpen] = useState(false);
  const maxDob = subYears(new Date(), MINIMUM_STUDENT_AGE);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    function handleMouseDown(e: MouseEvent) {
      if (!(e.target instanceof Node) || !ref.current?.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      <p className="text-sm text-primaryText font-semibold mb-1">{label}</p>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`text-left outline-none border  w-full p-2 pl-3 text-sm rounded-lg border-borderDividers bg-surfaceSideBar ${value ? "text-primaryText" : "text-secondaryText"} `}
      >
        {value ? format(value, "dd/MM/yyyy") : "Select date"}
      </button>

      {isOpen && (
        <div className="absolute z-10 top-full left-0 mt-2 bg-cardBG border border-borderDividers rounded-lg p-2">
          <DayPicker
            mode="single"
            required
            selected={value}
            onSelect={(d) => {
              onChange(d);
              setIsOpen(false);
            }}
            captionLayout="dropdown"
            defaultMonth={value ?? new Date(2005, 0)}
            startMonth={new Date(1970, 0)}
            endMonth={maxDob}
            disabled={{ after: maxDob }}
          />
        </div>
      )}
    </div>
  );
}

export default CreateStudentDateInput;
