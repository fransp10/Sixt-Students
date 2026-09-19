import { ClipboardIcon, EyeIcon } from "@heroicons/react/24/outline";
import type { Student } from "../../types/students";

function ContractTableRow({
  month,
  student,
  status,
}: {
  status: "approved" | "pending" | "rejected" | "not_uploaded";
  student: Student | undefined;
  month: string;
}) {
  const statusColors = {
    approved: "bg-green-500/20 text-green-300",
    pending: "bg-yellow-500/20 text-yellow-300",
    rejected: "bg-red-500/20 text-red-300",
    not_uploaded: "bg-gray-500/20 text-gray-300",
  };

  return (
    <tr className="h-14 border-b border-borderDividers text-left text-sm">
      <td className="px-4 py-3">{month}</td>
      <td className="px-4 py-3 ">
        <div
          className={`inline-flex w-24 items-center justify-center rounded-xl px-2.5 py-1 text-xs font-semibold ${statusColors[status]}`}
        >
          <span className="uppercase">{status}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-primaryText">
          <ClipboardIcon className="size-5 " />
          <span> contract-{month}.pdf</span>
        </div>
      </td>
      <td className="px-4 py-3">{month}</td>
      <td className="px-4 py-3">
        <button className="border hover:bg-borderDividers border-borderDividers p-2 cursor-pointer">
          <div className="flex items-center gap-2 text-sm text-primaryText">
            <EyeIcon className="size-5 text-icons" />
            <span>View</span>
          </div>
        </button>
      </td>
    </tr>
  );
}

export default ContractTableRow;
