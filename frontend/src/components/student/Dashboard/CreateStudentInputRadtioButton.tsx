type CreateStudentInputRadtioButton = {
  label: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
};

function CreateStudentInputRadtioButton({
  label,
  selected,
  onSelect,
  disabled = false,
}: CreateStudentInputRadtioButton) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={`border-2 flex-1 h-12 rounded-lg text-xs flex items-center justify-center gap-3 transition-colors enabled:cursor-pointer   ${
        selected
          ? "border-primary"
          : "border-borderDividers enabled:hover:border-secondaryText"
      }`}
    >
      <span
        className={`size-5 rounded-full border-2 flex items-center justify-center ${
          selected ? "border-primary" : "border-icons"
        }`}
      >
        {selected && <span className="size-2.5 rounded-full bg-primary" />}
      </span>
      <span>{label}</span>
    </button>
  );
}

export default CreateStudentInputRadtioButton;
