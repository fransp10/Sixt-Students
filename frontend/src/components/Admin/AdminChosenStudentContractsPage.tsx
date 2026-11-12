import { useState } from "react";
import { useParams } from "react-router-dom";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { useGetUserById } from "../../hooks/useGetUserById";import { useGetContractsOfStudent } from "../../hooks/useGetContractsOfStudent";
import { getContractMonths } from "../../helpers/studentContractMonths";
import LoadingSpinner from "../LoadingSpinner";
import StudentContractRow from "./StudentContracts/StudentContractRow";
import StudentContractsToolbar from "./StudentContracts/StudentContractsToolbar";
import { GLOBAL_APP_FIRST_YEAR } from "../../helpers/constants";

function AdminChosenStudentContractsPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { userId } = useParams<{ userId: string }>();
  const studentId = Number(userId);
  const { data: student, isLoading: isStudentLoading } = useGetUserById(
    userId!,
  );
  const {
    data: contracts,
    isLoading: isContractsLoading,
    isError,
  } = useGetContractsOfStudent(studentId);

  const fullName = student
    ? `${student.first_name} ${student.last_name}`
    : "This student";
  const firstName = student?.first_name ?? "This student";

  if (isStudentLoading || isContractsLoading) {
    return (
      <div className="flex justify-center p-10">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (isError || !contracts) {
    return (
      <p className="p-6 text-sm text-danger">
        Couldn't load the contracts. Refresh the page to try again.
      </p>
    );
  }

  const months = getContractMonths(
    selectedYear,
    contracts,
    student?.created_at,
  );

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      <StudentContractsToolbar
        year={selectedYear}
        firstYear={GLOBAL_APP_FIRST_YEAR}
        lastYear={currentYear}
        months={months}
        onYearChange={setSelectedYear}
      />

      {months.length > 0 ? (
        <ul
          className="divide-y divide-borderDividers overflow-hidden rounded-xl border border-borderDividers bg-cardBG"
        >
          {months.map((item) => (
            <StudentContractRow
              key={item.month.toISOString()}
              item={item}
              studentId={studentId}
              studentName={fullName}
            />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-borderDividers px-6 py-14 text-center">
          <ClipboardDocumentIcon className="size-8 text-icons" />
          <p className="mt-3 text-base font-semibold text-primaryText">
            No contracts in {selectedYear}
          </p>
          <p className="mt-1 max-w-sm text-sm text-secondaryText">
            {student?.created_at &&
            new Date(student.created_at).getFullYear() > selectedYear
              ? `${firstName} started in ${format(new Date(student.created_at), "MMMM yyyy")}, so there is nothing to upload for ${selectedYear}.`
              : "Nothing here yet."}
          </p>
          {selectedYear !== currentYear && (
            <button
              type="button"
              onClick={() => setSelectedYear(currentYear)}
              className="mt-5 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primaryText cursor-pointer transition-opacity hover:opacity-90"
            >
              Go to {currentYear}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminChosenStudentContractsPage;
