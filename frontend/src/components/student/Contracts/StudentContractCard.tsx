import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  BookOpenIcon,
  ClipboardDocumentIcon,
  DocumentTextIcon,
  LockClosedIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { format, parseISO } from "date-fns";
import type { ContractsWithoutSignedUrl } from "../../../types/contracts";
import { useGetContract } from "../../../hooks/useGetContract";
import { useState } from "react";

type StudentContractCardProps = {
  month: Date;
  contract?: ContractsWithoutSignedUrl;
  isUploadable: boolean;
  onUpload: () => void;
};

function StudentContractCard({
  month,
  contract,
  isUploadable,
  onUpload,
}: StudentContractCardProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { mutate: openContract } = useGetContract(format(month, "yyyy-MM"));

  return (
    <div className="flex h-full flex-col gap-5 rounded-xl border border-borderDividers bg-cardBG p-5">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardDocumentIcon className="size-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-primaryText">
              {format(month, "MMMM yyyy")}
            </p>
            <p className="text-xs text-secondaryText">Monthly work contract</p>
          </div>
        </div>

        {contract ? (
          <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-success">
            <span className="size-2 rounded-full bg-success" />
            Uploaded
          </span>
        ) : (
          <span
            className={`flex shrink-0 items-center gap-1.5 text-xs font-semibold ${isUploadable ? "text-warning" : "text-secondaryText"}`}
          >
            <span
              className={`size-2 rounded-full ${isUploadable ? "bg-warning" : "bg-icons"}`}
            />
            Not uploaded
          </span>
        )}
      </div>

      {/* BODY */}
      {contract && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 rounded-lg border border-borderDividers bg-cardLighterBG p-3">
            <div className="flex flex-1 items-center gap-3 min-w-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-borderDividers">
                <DocumentTextIcon className="size-5 text-secondaryText" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-primaryText">
                  {contract.file_name}
                </p>
                <p className="text-xs text-secondaryText">
                  {(contract.file_size / 1024 / 1024).toFixed(1)} MB · Uploaded{" "}
                  {format(parseISO(contract.uploaded_at), "MMM d, HH:mm")}
                </p>
              </div>
            </div>

            {!isConfirmOpen && (
              <button
                onClick={() => setIsConfirmOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-borderDividers text-secondaryText transition-colors hover:border-danger hover:text-danger cursor-pointer "
              >
                <XMarkIcon className="size-8 text-danger" />
              </button>
            )}

            {isConfirmOpen && (
              <div className="flex items-center gap-2 text-sm *:transition-colors w-full sm:w-auto  ">
                <button className="text-primaryText p-2 rounded-lg bg-danger cursor-pointer hover:bg-danger/80 flex-1 sm:flex-none ">
                  DELETE
                </button>
                <button
                  onClick={() => setIsConfirmOpen(false)}
                  className="text-primaryText p-2 rounded-lg border-2 border-borderDividers cursor-pointer hover:bg-surfaceCards flex-1 sm:flex-none "
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => openContract(true)}
              className="flex min-h-9 items-center justify-center gap-2 rounded-lg border border-borderDividers px-3 text-sm font-semibold text-primaryText cursor-pointer transition-colors hover:border-primary hover:text-primary"
            >
              <ArrowDownTrayIcon className="size-4" />
              Download
            </button>

            <button
              onClick={() => openContract(false)}
              type="button"
              className="flex min-h-9 items-center justify-center gap-2 rounded-lg border border-borderDividers px-3 text-sm font-semibold text-primaryText cursor-pointer transition-colors hover:border-primary hover:text-primary"
            >
              <BookOpenIcon className="size-4" />
              View in browser
            </button>

            {isUploadable ? (
              <button
                type="button"
                onClick={onUpload}
                className="flex min-h-9 items-center justify-center gap-2 rounded-lg border border-borderDividers px-3 text-sm font-semibold text-primaryText cursor-pointer transition-colors hover:border-primary hover:text-primary"
              >
                <ArrowPathIcon className="size-4" />
                Replace file
              </button>
            ) : (
              <span className="flex min-h-9 items-center gap-2 px-1 text-xs text-secondaryText">
                <LockClosedIcon className="size-4 shrink-0 text-icons" />
                Upload window closed, this contract can't be replaced
              </span>
            )}
          </div>
        </div>
      )}

      {!contract && isUploadable && (
        <button
          type="button"
          onClick={onUpload}
          className="group flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-borderDividers p-8 text-center cursor-pointer transition-colors hover:border-primary hover:bg-primary/5"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <ArrowUpTrayIcon className="size-6 text-primary" />
          </div>
          <p className="text-sm font-semibold text-primaryText group-hover:text-primary">
            Upload your {format(month, "MMMM")} contract
          </p>
          <p className="text-xs text-secondaryText">PDF up to 10 MB</p>
        </button>
      )}
    </div>
  );
}

export default StudentContractCard;
