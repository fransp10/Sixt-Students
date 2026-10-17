type CreateStudentInput = {
  required: boolean;
  label: string;
  placeholder?: string;
  style?: string;
  value: string;
  setter?: (value: string) => void;
  error?: string;
};

function CreateStudentInput({
  required = true,
  label,
  placeholder,
  style,
  value,
  setter,
  error,
}: CreateStudentInput) {
  return (
    <label className={`${style}`}>
      <p
        className={`text-sm font-semibold mb-1 ${required ? "text-primaryText" : "text-secondaryText"}`}
      >
        {label}
      </p>
      <input
        required={required}
        value={value}
        onChange={(e) => setter && setter(e.target.value)}
        aria-invalid={!!error}
        className={`outline-none border w-full p-2 pl-3 text-sm rounded-lg bg-surfaceSideBar transition-colors ${
          error
            ? "border-danger focus:border-danger"
            : "border-borderDividers focus:border-pending"
        }`}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </label>
  );
}

export default CreateStudentInput;
