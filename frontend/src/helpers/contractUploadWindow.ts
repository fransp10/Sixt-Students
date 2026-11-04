import { addMonths, isAfter, isBefore, startOfMonth } from "date-fns";
import {
  CONTRACT_UPLOAD_MONTHS_AHEAD,
  CONTRACT_UPLOAD_MONTHS_BACK,
} from "./constants";

// students can upload for previous month, the current month and 3 months ahead
export function getContractUploadWindow() {
  const currentMonth = startOfMonth(new Date());

  return {
    firstMonth: addMonths(currentMonth, -CONTRACT_UPLOAD_MONTHS_BACK),
    lastMonth: addMonths(currentMonth, CONTRACT_UPLOAD_MONTHS_AHEAD),
  };
}

export function isContractMonthUploadable(month: Date) {
  const { firstMonth, lastMonth } = getContractUploadWindow();

  return !isBefore(month, firstMonth) && !isAfter(month, lastMonth);
}
