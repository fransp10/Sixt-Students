import type { ReactNode } from "react";
import { CELL_THEME } from "../../../config/calendarCellTheme";
import type { CalendarCellKind } from "../../../helpers/getCalendarCellState";

type CellFrameProps = {
  kind: CalendarCellKind;
  onClick: () => void;
  ariaLabel?: string;
  // replaces the default status label
  label?: string;
  // empty cells draw their own content without a status header
  hideHeader?: boolean;
  children?: ReactNode;
};

function CellFrame({
  kind,
  onClick,
  ariaLabel,
  label,
  hideHeader = false,
  children,
}: CellFrameProps) {
  const { Icon, text, frame, label: defaultLabel } = CELL_THEME[kind];
  const statusLabel = label ?? defaultLabel;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ? `${ariaLabel}, ${statusLabel}` : undefined}
      className={`${frame} flex w-full cursor-pointer flex-col gap-2 rounded-lg border bg-(--cell-bg) p-3 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
    >
      {!hideHeader && (
        <span className={`flex items-center gap-1.5 ${text}`}>
          {kind === "active" ? (
            <span className="relative flex size-2.5 shrink-0 items-center justify-center">
              <span className="absolute inline-flex size-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
          ) : (
            <Icon className="size-4 shrink-0" />
          )}
          <span className="text-xs font-medium">{statusLabel}</span>
        </span>
      )}
      {children}
    </button>
  );
}

export default CellFrame;
