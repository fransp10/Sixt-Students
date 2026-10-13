import { XMarkIcon } from "@heroicons/react/24/outline";
import { createPortal } from "react-dom";

type CreateStudentModalProps = {
  handleCloseModal: () => void;
};

function CreateStudentModal({ handleCloseModal }: CreateStudentModalProps) {
  return createPortal(
    <div className="fixed flex items-center justify-center inset-0 bg-black/60">
      <div className="w-82 h-82 bg-cardBG p-4 border border-borderDividers rounded-lg flex flex-col gap-4 text-primaryText relative">
        Create student modal
        <button
          className="absolute right-3 top-3  bg-cardLighterBG text-surfaceCards rounded-lg  transition-colors cursor-pointer hover:text-danger"
          onClick={handleCloseModal}
        >
          <XMarkIcon className="size-8 p-2" />
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default CreateStudentModal;
