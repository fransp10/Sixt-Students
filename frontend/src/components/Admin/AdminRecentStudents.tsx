import { useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { useRecentStudents } from "../../hooks/useRecentStudents";
import { useSendPasswordResetEmail } from "../../hooks/useSendPasswordResetEmail";
import type { OnboardingStatus, RecentStudent } from "../../types/recentSudent";
import { STUDENTS_SHOWN_IN_ADMIN_RECENT_STUDENTS } from "../../helpers/constants";

const statusStyles: Record<
  OnboardingStatus,
  { label: string; text: string; dot: string }
> = {
  not_signed_in: {
    label: "Hasn't signed in yet",
    text: "text-warning",
    dot: "bg-warning",
  },
  no_requests: {
    label: "No shifts requested yet",
    text: "text-pending",
    dot: "bg-pending",
  },
  active: { label: "Active", text: "text-success", dot: "bg-success" },
  deactivated: {
    label: "Deactivated",
    text: "text-secondaryText",
    dot: "bg-icons",
  },
};

function AdminRecentStudents() {
  const {
    data: students,
    isLoading,
    isError,
  } = useRecentStudents(STUDENTS_SHOWN_IN_ADMIN_RECENT_STUDENTS);
  const sendLinkMutation = useSendPasswordResetEmail();

  const [sentTo, setSentTo] = useState<number[]>([]);

  function handleResendLink(student: RecentStudent) {
    if (!student.email) return;
    sendLinkMutation.mutate(
      { userId: String(student.id), email: student.email },
      { onSuccess: () => setSentTo((prev) => [...prev, student.id]) },
    );
  }

  function renderAction(student: RecentStudent) {
    if (student.onboarding_status !== "not_signed_in") return null;

    // students created with a temporary password may have no email
    if (!student.email) {
      return (
        <span className="text-xs text-secondaryText mr-4">
          No email on file
        </span>
      );
    }

    if (sentTo.includes(student.id)) {
      return <span className="text-xs text-success  mr-4">Link sent</span>;
    }

    const isSending =
      sendLinkMutation.isPending &&
      sendLinkMutation.variables?.userId === String(student.id);

    return (
      <button
        type="button"
        onClick={() => handleResendLink(student)}
        disabled={sendLinkMutation.isPending}
        className="min-h-9 rounded-lg border border-borderDividers px-3 text-sm font-semibold text-primaryText cursor-pointer hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSending ? "Sending..." : "Resend link"}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4 col-span-full bg-cardBG h-120 p-4 rounded-lg">
      <div>
        <h2 className="text-primaryText font-bold">Recently added students</h2>
        <p className="text-xs text-secondaryText">
          The {STUDENTS_SHOWN_IN_ADMIN_RECENT_STUDENTS} newest students and how
          far they got with getting started
        </p>
      </div>

      {isLoading && <p className="text-sm text-secondaryText">Loading...</p>}

      {isError && (
        <p className="text-sm text-secondaryText">
          Couldn't load recently added students
        </p>
      )}

      {!isLoading && !isError && !students?.length && (
        <p className="text-sm text-secondaryText">No students yet</p>
      )}

      {sendLinkMutation.isError && (
        <p className="text-sm text-danger">Couldn't send the link, try again</p>
      )}

      {!!students?.length && (
        <div className="min-h-0 flex-1 overflow-y-auto pr-4 scrollbar-thumb-cardLighterBG">
          <table className="w-full min-w-150 text-left text-sm">
            <thead className="sticky top-0 bg-cardBG text-xs text-secondaryText">
              <tr className="border-b border-borderDividers">
                <th className="py-2 pr-4 font-medium">Student</th>
                <th className="py-2 pr-4 font-medium">Added</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 font-medium">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const status = statusStyles[student.onboarding_status];

                return (
                  <tr
                    key={student.id}
                    className="border-b border-borderDividers last:border-0"
                  >
                    <td className="py-2.5 pr-4">
                      <Link
                        to={`/admin/students/${student.id}`}
                        className="font-semibold text-primaryText hover:text-primary"
                      >
                        {student.first_name} {student.last_name}
                      </Link>
                      <p className="text-xs text-secondaryText">
                        {student.email ?? "No email"}
                      </p>
                    </td>
                    <td className="py-2.5 pr-4 text-secondaryText">
                      {formatDistanceToNow(parseISO(student.created_at), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={`flex items-center gap-1.5 text-xs font-semibold ${status.text}`}
                      >
                        <span className={`size-2 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center justify-end gap-2">
                        {student.id && renderAction(student)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminRecentStudents;
