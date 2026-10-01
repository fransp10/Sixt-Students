import { CheckCircleIcon } from "@heroicons/react/24/outline";

function SuccessView({ handleCloseModal }: { handleCloseModal: () => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-10 px-6">
      <div className="bg-success/10 p-3 rounded-full">
        <CheckCircleIcon className="size-10 text-success" />
      </div>
      <div>
        <p className="text-lg font-semibold text-primaryText">
          Password updated
        </p>
        <p className="text-sm text-secondaryText">
          Use your new password the next time you sign in.
        </p>
      </div>
      <button
        autoFocus
        onClick={handleCloseModal}
        className="mt-2 p-2 px-8 bg-primary cursor-pointer hover:bg-primary/80 rounded-xl text-nowrap"
      >
        Done
      </button>
    </div>
  );
}

export default SuccessView;
