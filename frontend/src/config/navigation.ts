import {
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import type { NavItemType } from "../types/NavItem";

export const adminNavItems: NavItemType[] = [
  {
    label: "Dashboard",
    to: "/admin",
    icon: HomeIcon,
    end: true,
  },
  {
    label: "Schedule",
    to: "/admin/schedule",
    icon: CalendarIcon,
  },
  {
    label: "Students",
    to: "/admin/students",
    icon: UsersIcon,
  },
  {
    label: "Earnings",
    to: "/admin/earnings",
    icon: BanknotesIcon,
  },
  {
    label: "Settings",
    to: "/admin/settings",
    icon: Cog6ToothIcon,
  },
];

export const studentNavItems: NavItemType[] = [
  {
    label: "Dashboard",
    to: "/student/dashboard",
    icon: HomeIcon,
    end: true,
  },
  {
    label: "Schedule",
    to: "/student/schedule",
    icon: CalendarIcon,
  },
  {
    label: "Contracts",
    to: "/student/contracts",
    icon: DocumentTextIcon,
  },
  {
    label: "Earnings",
    to: "/student/earnings",
    icon: BanknotesIcon,
  },
  {
    label: "Settings",
    to: "/student/settings",
    icon: Cog6ToothIcon,
  },
];
