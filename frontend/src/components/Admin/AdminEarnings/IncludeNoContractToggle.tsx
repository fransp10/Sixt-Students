// lets the admin see the total as if students without a contract were paid too
function IncludeNoContractToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-secondaryText transition-colors hover:text-primaryText"
    >
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-primary" : "bg-borderDividers"}`}
      >
        <span
          className={`absolute left-0.5 top-0.5 size-4 rounded-full bg-white transition-transform ${checked ? "translate-x-4" : ""}`}
        />
      </span>
      Include students without a contract
    </button>
  );
}

export default IncludeNoContractToggle;
