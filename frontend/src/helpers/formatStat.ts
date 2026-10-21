export function formatStat(n: number, unit = ""): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 1 }) + unit;
}
