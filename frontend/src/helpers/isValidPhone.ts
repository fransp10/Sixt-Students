// same rule as backend/src/helpers/isValidPhone.ts
const PHONE_REGEX = /^\+?[0-9]{6,15}$/;

export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.replace(/[\s-]/g, ""));
}
