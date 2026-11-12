import {
  CheckCircleIcon,
  ClockIcon,
  PlayCircleIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";
import type { CalendarCellKind } from "../helpers/getCalendarCellState";

type CellTheme = {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  // colour of the status label and icon
  text: string;
  // group, border and background (with hover) of the cell itself
  frame: string;
  // avatar ring, matching the cell background so overlapping avatars look cut out
  ring: string;
};

export const CELL_THEME: Record<CalendarCellKind, CellTheme> = {
  assigned: {
    label: "You are assigned",
    Icon: CheckCircleIcon,
    text: "text-success",
    frame:
      "group border-success/30 border-l-[3px] border-l-success bg-cellAssigned hover:bg-cellAssignedHover",
    ring: "ring-cellAssigned group-hover:ring-cellAssignedHover",
  },
  requested: {
    label: "You requested",
    Icon: ClockIcon,
    text: "text-pending",
    frame:
      "group border-pending/30 border-l-[3px] border-l-pending bg-cellRequested hover:bg-cellRequestedHover",
    ring: "ring-cellRequested group-hover:ring-cellRequestedHover",
  },
  active: {
    label: "Current shift",
    Icon: PlayCircleIcon,
    text: "text-primary",
    frame:
      "group border-primary/40 border-l-3 rounded-none border-l-primary bg-cellActive hover:bg-cellActiveHover",
    ring: "ring-cellActive group-hover:ring-cellActiveHover",
  },
  others: {
    label: "Upcoming",
    Icon: UserGroupIcon,
    text: "text-secondaryText",
    frame:
      "group border-borderDividers border-l-[3px] border-l-surfaceCards bg-cellOthers hover:bg-cellOthersHover",
    ring: "ring-cellOthers group-hover:ring-cellOthersHover",
  },
  empty: {
    label: "No requests or assignments",
    Icon: UsersIcon,
    text: "text-secondaryText",
    frame:
      "group border-dashed border-surfaceCards bg-transparent hover:border-primary/60 hover:bg-cellEmptyHover",
    ring: "ring-transparent group-hover:ring-cellEmptyHover",
  },
  passed: {
    label: "Shift passed",
    Icon: CheckCircleIcon,
    text: "text-secondaryText",
    frame:
      "group border-borderDividers/70 bg-cellPassed hover:bg-cellPassedHover",
    ring: "ring-cellPassed group-hover:ring-cellPassedHover",
  },
};
