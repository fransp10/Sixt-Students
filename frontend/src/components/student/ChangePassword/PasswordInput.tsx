import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type PasswordInputProps = {
  label: string;
  placeholder: string;
  setValue: (value: string) => void;
  onFocus?: () => void;
};

function PasswordInput({
  label,
  placeholder,
  setValue,
  onFocus,
}: PasswordInputProps) {
  const [showField, setShowField] = useState(false);
  return (
    <div>
      <label className="flex flex-col gap-1">
        <span className="text-base font-semibold text-primaryText">
          {label}
        </span>
        <div className="flex bg-cardLighterBG border focus-within:border-pending border-borderDividers rounded-xl p-2">
          <input
            onFocus={onFocus}
            onChange={(e) => setValue(e.target.value.trim())}
            className="ml-2 w-full h-10 outline-none"
            placeholder={placeholder}
            type={showField ? "text" : "password"}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowField(!showField);
            }}
            className="ml-2 p-2 bg-cardLighterBG cursor-pointer  hover:bg-pageBackground rounded-xl"
          >
            {" "}
            {showField ? (
              <EyeIcon className="size-5 sm:size-6 text-icons" />
            ) : (
              <EyeSlashIcon className="size-5 sm:size-6 text-icons" />
            )}
          </button>
        </div>
      </label>
    </div>
  );
}

export default PasswordInput;
