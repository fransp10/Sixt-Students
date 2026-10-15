type CreateStudentInput = {
  label: string;
  placeholder?: string;
  style?: string;
  value: string;
  setter?: (value: string) => void;
};

function CreateStudentInput({
  label,
  placeholder,
  style,
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
