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
  // border, background and the --cell-bg variable the avatar rings borrow
  frame: string;
};

// Every cell sits on the calendar surface (cardBG). --cell-bg is the opaque
// colour a tinted cell ends up as, so overlapping avatars can ring against it.
export const CELL_THEME: Record<CalendarCellKind, CellTheme> = {
  assigned: {
    label: "You are assigned",
    Icon: CheckCircleIcon,
    text: "text-success",
    frame:
      "border-success/30 border-l-[3px] border-l-success [--cell-bg:color-mix(in_srgb,var(--color-success)_10%,var(--color-cardBG))] hover:[--cell-bg:color-mix(in_srgb,var(--color-success)_17%,var(--color-cardBG))]",
  },
  requested: {
    label: "You requested",
    Icon: ClockIcon,
    text: "text-pending",
    frame:
      "border-pending/30 border-l-[3px] border-l-pending [--cell-bg:color-mix(in_srgb,var(--color-pending)_10%,var(--color-cardBG))] hover:[--cell-bg:color-mix(in_srgb,var(--color-pending)_17%,var(--color-cardBG))]",
  },
  active: {
    label: "Current shift",
    Icon: PlayCircleIcon,
    text: "text-primary",
    frame:
      "border-primary/40 border-l-[3px] border-l-primary [--cell-bg:color-mix(in_srgb,var(--color-primary)_12%,var(--color-cardBG))] hover:[--cell-bg:color-mix(in_srgb,var(--color-primary)_19%,var(--color-cardBG))]",
  },
  others: {
    label: "Upcoming",
    Icon: UserGroupIcon,
    text: "text-secondaryText",
    frame:
      "border-borderDividers border-l-[3px] border-l-surfaceCards [--cell-bg:var(--color-cardLighterBG)] hover:[--cell-bg:var(--color-darkBackground)]",
  },
  empty: {
    label: "No requests or assignments",
    Icon: UsersIcon,
    text: "text-secondaryText",
    frame:
      "border-dashed border-surfaceCards [--cell-bg:transparent] hover:border-primary/60 hover:[--cell-bg:color-mix(in_srgb,var(--color-primary)_6%,var(--color-cardBG))]",
  },
  passed: {
    label: "Shift passed",
    Icon: CheckCircleIcon,
    text: "text-secondaryText",
    frame:
      "border-borderDividers/70 [--cell-bg:color-mix(in_srgb,var(--color-pageBackground)_45%,var(--color-cardBG))] hover:[--cell-bg:var(--color-cardLighterBG)]",
  },
};
