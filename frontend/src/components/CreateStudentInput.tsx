import { DayPicker } from "react-day-picker";

type CreateStudentInput = {
  label: string;
  placeholder?: string;
  valueType?: "number" | "date" | "text";
  style?: string;
  value: string;
  setter?: (value: string) => void;
};

function CreateStudentInput({
  label,
  placeholder,
  style,
  valueType,
  value,
  setter,
}: CreateStudentInput) {
  return (
    <label className={`${style}`}>
      <p className="text-sm text-primaryText font-semibold mb-1">{label}</p>
      <input
        value={value}
        onChange={(e) => setter && setter(e.target.value)}
        className="outline-none border  w-full p-2 pl-3 text-sm rounded-lg border-borderDividers bg-surfaceSideBar"
        placeholder={placeholder}
      />
    </label>
  );
}

export default CreateStudentInput;
type DatePickerTypes = {
  date: Date;
  setDate: (date: Date) => void;
  isOpen: boolean;
  setIsOpen: () => void;
};
function DatePicker({ isOpen, setIsOpen, date, setDate }: DatePickerTypes) {
  return (
    <div>
      <DayPicker
        mode="single"
        selected={dob}
        onSelect={setDob}
        captionLayout="dropdown" // month and year dropdowns, essential for DoB
        startMonth={new Date(1970, 0)}
        endMonth={new Date()}
        disabled={{ after: new Date() }}
      />
    </div>
  );
}
