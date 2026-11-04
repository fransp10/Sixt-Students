import {
  DocumentArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { useUploadContract } from "../../hooks/useUploadContract";
import { getErrorMessage } from "../../helpers/getErrorMessage";

type UploadContractModalProps = {
  onClose: () => void;
  month: Date;
};

function UploadContractModal({ onClose, month }: UploadContractModalProps) {
  const {
    selectedFile,
    isDragging,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileChange,
    uploadContract,
    isErrorUploading,
    isPendingUploading,
    uploadingError,
    handleFileRemove,
    handleClose,
    handleCancelAndClose,
  } = useUploadContract(onClose);

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={` w-72 sm:w-102 lg:w-140 m-6  bg-cardBG rounded-xl border  border-borderDividers p-4 text-center`}
      >
        <div className="flex items-center justify-between p-2 ">
          <p className=" font-medium text-primaryText">
            Upload Contract for {format(month, "MMMM y")}
          </p>

          <button
            onClick={handleCancelAndClose}
            title={isPendingUploading ? "Cancel upload" : "Close"}
            className="group p-1 border border-borderDividers rounded-lg hover:bg-white/5 transition-colors size-8 cursor-pointer"
          >
            <XMarkIcon className="size-6 shrink-0 text-secondaryText group-hover:text-red-500" />
          </button>
        </div>
        {isErrorUploading && (
          <p className=" bg-danger/10 p-4 text-xs sm:text-sm text-danger rounded-lg mt-2">
            {getErrorMessage(
              uploadingError,
              "Upload failed. Please try again.",
            )}
          </p>
        )}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          className={`rounded-xl border border-dashed flex flex-col gap-4  p-8 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-borderDividers"
          } ${isPendingUploading ? "pointer-events-none opacity-50" : ""}`}
        >
          <div className="flex flex-col items-center ">
            <DocumentArrowUpIcon className="mx-auto size-10 text-secondaryText" />
            <p className="mt-1 text-sm text-primaryText">
              Drag and drop your file here
            </p>
            <p className="mt-1 text-sm text-secondaryText">
              or click to browse
            </p>
            <p className="mt-1 text-sm text-secondaryText">PDF up to 10 MB</p>
          </div>
          <label
            htmlFor="contract-file"
            className="cursor-pointer rounded-lg border border-borderDividers px-4 py-2 text-primaryText"
          >
            Choose file
          </label>
          <input
            id="contract-file"
            type="file"
            accept=".pdf"
            disabled={isPendingUploading}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        {selectedFile && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-borderDividers p-4 gap-4">
            <div className="w-full">
              <div className="flex flex-row gap-2">
                <div className="flex items-center size-10 bg-borderDividers rounded-lg p-2">
                  <DocumentIcon className="size-6 text-secondaryText" />
                </div>
                <div className="flex flex-col text-left  w-full gap-1">
                  <p className="text-xs sm:text-base  font-medium text-primaryText">
                    {selectedFile.name}
                  </p>

                  <p className="text-sm text-secondaryText">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  disabled={isPendingUploading}
                  onClick={() => handleFileRemove()}
                  className="text-secondaryText enabled:hover:text-red-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <XMarkIcon className="size-5" />
                </button>
              </div>
              <div className="mt-4 flex justify-end  ">
                <button
                  disabled={isPendingUploading}
                  onClick={() =>
                    uploadContract({
                      month: format(month, "yyyy-MM"),
                      file: selectedFile,
                    })
                  }
                  className="flex items-center justify-center gap-2 bg-primary text-primaryText rounded-xl enabled:hover:bg-primary/80 cursor-pointer w-full p-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPendingUploading ? (
                    <>
                      <span className="size-4 rounded-full border-2 border-primaryText border-t-transparent animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadContractModal;
