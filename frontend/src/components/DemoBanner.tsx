import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { IS_DEMO_MODE } from "../config/demo";

// Tells visitors of the hosted demo what to expect. Renders nothing in a normal build.
// className lets each page set its own width and margins.
function DemoBanner({ className = "" }: { className?: string }) {
  if (!IS_DEMO_MODE) {
    return null;
  }

  return (
    <div
      className={`flex w-full items-start gap-2 rounded-lg border border-warning/30 bg-cardBG px-3 py-2 text-left text-xs text-warning ${className}`}
    >
      <InformationCircleIcon className="mt-px size-4 shrink-0" />
      <p>
        Demo with fictional data that resets every night. Emails are not sent
        and password changes are disabled.
      </p>
    </div>
  );
}

export default DemoBanner;
