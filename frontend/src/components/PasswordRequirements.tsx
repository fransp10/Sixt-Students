import { StopIcon } from "@heroicons/react/24/outline";

function PasswordRequirements({
  requirements,
}: {
  requirements: { label: string; met: boolean }[];
}) {
  return (
    <div className="flex flex-col w-full ">
      <ul className="flex flex-col gap-1 mt-2 text-sm text-secondaryText">
        {requirements.map((requirement) => (
          <li key={requirement.label} className="flex items-center gap-1">
            {requirement.met ? (
              <StopIcon className="size-6 text-success fill-success" />
            ) : (
              <StopIcon className="size-6 " />
            )}

            <p className={`${requirement.met && "text-success"}`}>
              {requirement.label}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PasswordRequirements;
