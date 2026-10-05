export function isValidMonth(month: string): boolean {
  const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

  return monthRegex.test(month);
}
