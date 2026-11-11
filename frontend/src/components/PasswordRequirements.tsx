import { StopIcon } from "@heroicons/react/24/outline";

function PasswordRequirements({
  requirements,
}: {
  requirements: { label: string; met: boolean }[];
}) {
  return (
    <ul
      aria-label="Password requirements"
      className="flex flex-col gap-1 text-sm text-secondaryText"
    >
      {requirements.map((requirement) => (
        <li
          key={requirement.label}
          className={`flex items-center gap-1.5 ${requirement.met ? "text-success" : ""}`}
        >
          <StopIcon
            className={`size-5 shrink-0 ${requirement.met ? "fill-success" : ""}`}
          />
          <span>{requirement.label}</span>
        </li>
      ))}
    </ul>
  );
}

export default PasswordRequirements;
