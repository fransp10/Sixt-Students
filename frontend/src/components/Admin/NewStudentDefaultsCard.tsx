import { useState } from "react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { useGetAppSettings } from "../../hooks/useGetAppSettings";
import { MAX_HOURLY_RATE, MAX_MONTHLY_GOAL } from "../../helpers/constants";
import type { AppSettings } from "../../types/appSettings";
import LoadingSpinner from "../LoadingSpinner";
import SettingsCardHeader from "../student/SettingsCardHeader";
import AppSettingField from "./AppSettingField";

const MONEY_FORMAT = /^\d+(\.\d{1,2})?$/;

function validateHourlyRate(value: string) {
  if (!MONEY_FORMAT.test(value)) return "Enter a number like 8.56";
  if (Number(value) <= 0 || Number(value) > MAX_HOURLY_RATE) {
    return `Must be between 0 and ${MAX_HOURLY_RATE}`;
  }
  return null;
}

function validateMonthlyGoal(value: string) {
  if (!MONEY_FORMAT.test(value)) return "Enter a number like 600";
  if (Number(value) > MAX_MONTHLY_GOAL) {
    return `Must be at most ${MAX_MONTHLY_GOAL}`;
  }
  return null;
}

function NewStudentDefaultsCard() {
  const { data: settings, isPending, isError } = useGetAppSettings();
  const [editingField, setEditingField] = useState<keyof AppSettings | null>(
    null,
  );

  function closeField(field: keyof AppSettings) {
    setEditingField((current) => (current === field ? null : current));
  }

  return (
    <section
      aria-labelledby="new-student-defaults-heading"
      className="rounded-xl border border-borderDividers bg-cardBG p-5"
    >
      <SettingsCardHeader
        id="new-student-defaults-heading"
        icon={UserPlusIcon}
        title="New student defaults"
        subtitle="Starting values for the students you add."
      />
      {isPending && (
        <div className="mt-4 flex justify-center">
          <LoadingSpinner size={24} />
        </div>
      )}
      {isError && (
        <p className="mt-4 text-sm text-danger">
          Couldn't load the defaults. Please refresh the page.
        </p>
      )}
      {settings && (
        <div className="mt-2 divide-y divide-borderDividers">
          <AppSettingField
            field="new_student_hourly_rate"
            label="Hourly rate"
            description="Pre-filled when you add a student."
            placeholder="8.56"
            value={settings.new_student_hourly_rate}
            validate={validateHourlyRate}
            isEditing={editingField === "new_student_hourly_rate"}
            onEdit={() => setEditingField("new_student_hourly_rate")}
            onClose={() => closeField("new_student_hourly_rate")}
          />
          <AppSettingField
            field="new_student_monthly_goal"
            label="Monthly goal"
            description="Used when a student hasn't set a goal for the month."
            placeholder="600"
            value={settings.new_student_monthly_goal}
            validate={validateMonthlyGoal}
            isEditing={editingField === "new_student_monthly_goal"}
            onEdit={() => setEditingField("new_student_monthly_goal")}
            onClose={() => closeField("new_student_monthly_goal")}
          />
        </div>
      )}
    </section>
  );
}

export default NewStudentDefaultsCard;
