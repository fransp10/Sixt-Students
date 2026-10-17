import { format, subYears } from "date-fns";
import { useState } from "react";
import { MINIMUM_STUDENT_AGE } from "../../../helpers/constants";

type CreateStudentDateInputProps = {
  required?: boolean;
  label: string;
  value?: Date;
  onChange: (date?: Date) => void;
  error?: string; // from the parent form, e.g. "Date of birth is required"
};

type DateParts = { day: string; month: string; year: string };

const MONTHS = Array.from({ length: 12 }, (_, i) =>
  format(new Date(2000, i, 1), "MMMM"),
);

const fieldClass =
  "outline-none border p-2 text-sm rounded-lg bg-surfaceSideBar transition-colors";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function toDate({ day, month, year }: DateParts): Date | null {
  if (!day || month === "" || year.length !== 4) return null;

  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (y < 1900) return null;

  const date = new Date(y, m, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m ||
    date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

function CreateStudentDateInput({
  required = true,
  label,
  value,
  onChange,
  error,
}: CreateStudentDateInputProps) {
  const [parts, setParts] = useState<DateParts>(() =>
    value
      ? {
          day: String(value.getDate()),
          month: String(value.getMonth()),
          year: String(value.getFullYear()),
        }
      : { day: "", month: "", year: "" },
  );

  const maxDob = subYears(new Date(), MINIMUM_STUDENT_AGE);
  const date = toDate(parts);
  const isComplete =
    parts.day !== "" && parts.month !== "" && parts.year.length === 4;

  let dateError: string | undefined;
  if (isComplete && !date) {
    dateError = "Enter a valid date";
  } else if (date && date > maxDob) {
    dateError = `Student must be at least ${MINIMUM_STUDENT_AGE}`;
  }

  // The specific message ("must be at least 18") beats the parent's generic "required"
  const shownError = dateError ?? error;
  const borderClass = shownError
    ? "border-danger focus:border-danger"
    : "border-borderDividers focus:border-pending";

  function update(next: Partial<DateParts>) {
    const nextParts = { ...parts, ...next };
    setParts(nextParts);

    const nextDate = toDate(nextParts);
    onChange(nextDate && nextDate <= maxDob ? nextDate : undefined);
  }

  return (
    <fieldset>
      <legend
        className={`text-sm font-semibold mb-1 ${required ? "text-primaryText" : "text-secondaryText"}`}
      >
        {label}
      </legend>
      <div className="flex gap-2">
        <input
          required={required}
          aria-label="Day"
          placeholder="DD"
          inputMode="numeric"
          maxLength={2}
          value={parts.day}
          onChange={(e) => update({ day: digitsOnly(e.target.value) })}
          aria-invalid={!!shownError}
          className={`${fieldClass} ${borderClass} w-14 text-center`}
        />
        <select
          required={required}
          aria-label="Month"
          value={parts.month}
          onChange={(e) => update({ month: e.target.value })}
          aria-invalid={!!shownError}
          className={`${fieldClass} ${borderClass} flex-1 min-w-0 cursor-pointer scheme-dark [&>option]:text-primaryText ${
            parts.month === "" ? "text-secondaryText" : "text-primaryText"
          }`}
        >
          <option value="" disabled>
            Month
          </option>
          {MONTHS.map((name, i) => (
            <option key={name} value={i}>
              {name}
            </option>
          ))}
        </select>
        <input
          required={required}
          aria-label="Year"
          placeholder="YYYY"
          inputMode="numeric"
          maxLength={4}
          value={parts.year}
          onChange={(e) => update({ year: digitsOnly(e.target.value) })}
          aria-invalid={!!shownError}
          className={`${fieldClass} ${borderClass} w-18 text-center`}
        />
      </div>
      {shownError && <p className="mt-1 text-xs text-danger">{shownError}</p>}
    </fieldset>
  );
}

export default CreateStudentDateInput;
