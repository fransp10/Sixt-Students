import {
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useId, useState } from "react";

type PasswordInputProps = {
  label: string;
  placeholder: string;
  setValue: (value: string) => void;
  autoComplete?: "current-password" | "new-password";
  autoFocus?: boolean;
  error?: string | null;
};

function PasswordInput({
  label,
  placeholder,
  setValue,
  autoComplete = "new-password",
  autoFocus,
  error,
}: PasswordInputProps) {
  const [showField, setShowField] = useState(false);
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-primaryText">
        {label}
      </label>
      <div
        className={`flex items-center rounded-lg border bg-cardLighterBG pr-1 transition-colors ${error ? "border-danger" : "border-borderDividers focus-within:border-primary"}`}
      >
        <input
          id={id}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          onChange={(e) => setValue(e.target.value.trim())}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-10 w-full min-w-0 bg-transparent px-3 text-sm text-primaryText outline-none placeholder:text-icons"
          placeholder={placeholder}
          type={showField ? "text" : "password"}
        />
        <button
          type="button"
          onClick={() => setShowField(!showField)}
          aria-label={showField ? "Hide password" : "Show password"}
          aria-pressed={showField}
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-icons cursor-pointer transition-colors hover:bg-pageBackground hover:text-primaryText"
        >
          {showField ? (
            <EyeIcon className="size-5" />
          ) : (
            <EyeSlashIcon className="size-5" />
          )}
        </button>
      </div>
      {error && (
        <p
          id={`${id}-error`}
          className="flex items-center gap-1 text-xs text-danger"
        >
          <ExclamationCircleIcon className="size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export default PasswordInput;
