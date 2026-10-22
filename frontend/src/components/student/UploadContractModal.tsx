import {
  DocumentArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { useUploadContract } from "../../hooks/useUploadContract";

type UploadContractModalProps = {
  onClose: () => void;
  month: Date;
};

function UploadContractModal({ onClose, month }: UploadContractModalProps) {
  const {
    selectedFile,
    setSelectedFile,
    isDragging,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileChange,
    uploadContract,
  } = useUploadContract(onClose);
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className=" w-72 sm:w-102 lg:w-140 m-6  bg-cardBG rounded-xl border  border-borderDividers p-4 text-center"
      >
        <div className="flex items-center justify-between border-b border-borderDividers p-2 ">
          <p className=" font-medium text-primaryText">
            Upload Contract for {format(month, "MMMM Y")}
          </p>
          <button
            onClick={onClose}
            className="p-1 border border-borderDividers rounded-lg hover:bg-white/5 transition-colors size-8"
          >
            <XMarkIcon className="size-6 shrink-0 text-secondaryText hover:text-red-500 cursor-pointer " />
          </button>
        </div>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          className={`rounded-xl border border-dashed flex flex-col gap-4  p-8 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-borderDividers"
          }`}
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
                  onClick={() => setSelectedFile(null)}
                  className="text-secondaryText hover:text-red-500 cursor-pointer "
                >
                  <XMarkIcon className="size-5" />
                </button>
              </div>
              <div className="mt-4 flex justify-end  ">
                <button
                  onClick={() =>
                    uploadContract({
                      month: format(month, "yyyy-MM"),
                      file: selectedFile,
                    })
                  }
                  className="bg-primary text-primaryText rounded-xl hover:bg-primary/80 cursor-pointer w-full p-2"
                >
                  Upload
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
