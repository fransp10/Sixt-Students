type CreateStudentInput = {
  required: boolean;
  label: string;
  placeholder?: string;
  style?: string;
  value: string;
  setter?: (value: string) => void;
};

function CreateStudentInput({
  required = true,
  label,
  placeholder,
  style,
  value,
  setter,
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
        className="outline-none border  w-full p-2 pl-3 text-sm rounded-lg border-borderDividers bg-surfaceSideBar"
        placeholder={placeholder}
      />
    </label>
  );
}

export default CreateStudentInput;
