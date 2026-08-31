export function getInitials(name: string) {
  return name.split(" ")[0][0] + name.split(" ")[0][1].toUpperCase();
}
