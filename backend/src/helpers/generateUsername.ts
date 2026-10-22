import AppError from "../errors/AppError.js";

function toUsernamePart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/đ/g, "d") // đ doesn't split into letter + accent, so map it by hand
    .normalize("NFD") // š → s + accent mark
    .replace(/[\u0300-\u036f]/g, "") // remove the accent marks
    .replace(/[^a-z0-9]/g, ""); // remove spaces, hyphens, etc.
}

export function generateBaseUsername(
  firstName: string,
  lastName: string,
): string {
  return toUsernamePart(`${firstName}.${lastName}`);
}
