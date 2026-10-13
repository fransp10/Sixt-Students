function toUsernamePart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/đ/g, "d") // đ doesn't decompose with normalize(), so handle it by hand
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents: š→s, č→c, ć→c, ž→z
    .replace(/[^a-z0-9]/g, ""); // drop spaces, hyphens, etc.
}

export function generateUsername(firstName: string, lastName: string) {
  return [toUsernamePart(firstName), toUsernamePart(lastName)]
    .filter(Boolean)
    .join(".");
}
