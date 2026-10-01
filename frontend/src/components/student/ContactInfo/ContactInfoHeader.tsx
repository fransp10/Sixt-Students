import { EnvelopeIcon } from "@heroicons/react/24/outline";

function ContactInfoHeader() {
  return (
    <div className="flex items-center gap-4">
      <div>
        <EnvelopeIcon className="size-8 sm:size-10 text-primary" />
      </div>
      <div>
        <p className="text-lg sm:text-2xl font-semibold text-primary">
          Contact information
        </p>
        <p className="text-xs sm:text-md text-secondaryText">
          Keep your current details up to date.
        </p>
      </div>
    </div>
  );
}

export default ContactInfoHeader;
