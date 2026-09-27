import { BriefcaseIcon } from "@heroicons/react/24/outline";
import type { Student } from "../types/students";

function WorkSettingsCard({ student }: { student: Student | undefined }) {
  return (
    <div className="flex flex-1  flex-col bg-cardLighterBG rounded-lg p-4 gap-4">
      <div className="flex   items-center gap-4  ">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-icons/20">
          <BriefcaseIcon className="size-6 text-primary" />
        </div>
        <div>
          <h2 className="text-md">Work settings</h2>
          <p className="text-xs text-secondaryText">
            Employment configuration.
          </p>
        </div>
      </div>
      <div
        className="flex w-full flex-col gap-3 sm:flex-row sm:items-center 
          sm:justify-between border-b border-borderDividers pb-4"
      >
        <div>
          <p className="font-medium text-primaryText">Hourly rate</p>
          <p className="mt-1 text-sm text-secondaryText">
            Set the student's hourly rate.
          </p>
        </div>
        <div className="relative w-full sm:w-32">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-secondaryText">
            €
          </span>
          <input
            type="number"
            defaultValue={8.5}
            className=" w-full rounded-lg border border-borderDividers bg-cardLighterBG py-2 pl-8 pr-3 text-sm text-primaryText outline-none transition-colors focus:border-primary
             [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none 
             [&::-webkit-outer-spin-button]:appearance-none "
          />
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-4  sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-primaryText">Student/Employee ID</p>
        </div>
        <input
          type="text"
          disabled
          defaultValue={student?.id}
          className="w-full rounded-lg border border-borderDividers bg-cardLighterBG px-4 py-2 text-sm text-primaryText outline-none transition-colors focus:border-primary sm:w-32"
        />
      </div>
    </div>
  );
}

export default WorkSettingsCard;
