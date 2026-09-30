// helpers/getErrorMessage.ts
import { isAxiosError } from "axios";

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
) {
  if (isAxiosError<{ error?: string }>(error)) {
    return error.response?.data?.error ?? fallback;
  }
  return fallback;
}
