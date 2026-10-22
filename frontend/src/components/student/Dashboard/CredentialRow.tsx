import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

function CredentialRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-surfaceSideBar px-3 py-2">
      <div className="text-left">
        <p className="text-xs text-secondaryText">{label}</p>
        <p className="text-mono text-xs">{value}</p>
      </div>

      <div className="flex items-center gap-2">
        {copied && <span className="text-xs  text-success mr-2">Copied!</span>}
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs text-secondaryText hover:text-primaryText cursor-pointer"
        >
          {copied ? (
            <ClipboardDocumentCheckIcon className="size-6" />
          ) : (
            <ClipboardDocumentIcon className="size-6" />
          )}
        </button>
      </div>
    </div>
  );
}

export default CredentialRow;
