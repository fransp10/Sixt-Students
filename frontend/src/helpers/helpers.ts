import type { Student } from "../types/students";

export function getInitials(name: string) {
  return name.split(" ")[0][0] + name.split(" ")[0][1].toUpperCase();
}

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-400",
  "bg-rose-400",
];

export function getAvatarColor(userId: number) {
  return AVATAR_COLORS[userId % AVATAR_COLORS.length];
}

export function getFullName(student: Student | undefined) {
  return student ? `${student.first_name} ${student.last_name}` : "";
}
