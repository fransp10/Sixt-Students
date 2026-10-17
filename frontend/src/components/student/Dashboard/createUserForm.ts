import { format } from "date-fns";
import { isValidEmail } from "../../../helpers/isValidEmail";
import { MAX_HOURLY_RATE } from "../../../helpers/constants";
import type {
  CreateUserReqBodyType,
  SigninOption,
  UserRoles,
} from "../../../types/user";

// What the inputs hold while the admin is typing. Field names match the request body,
// only the types differ - toRequestBody() converts them once the form is valid
export type CreateUserFormValues = {
  first_name: string;
  last_name: string;
  email: string; // "" when empty
  default_hourly_rate: string; // raw input, so in-between values like "8." still work
  date_of_birth?: Date; // undefined until all three date fields form a valid date
  user_role: UserRoles;
  signin_option: SigninOption;
};

export type CreateUserFormErrors = Partial<
  Record<keyof CreateUserFormValues, string>
>;

export const INITIAL_FORM_VALUES: CreateUserFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  default_hourly_rate: "",
  date_of_birth: undefined,
  user_role: "student",
  signin_option: "tempPassword",
};

// Only call this after validation passed - it assumes date_of_birth is set
export function toRequestBody(
  values: CreateUserFormValues,
): CreateUserReqBodyType {
  return {
    first_name: values.first_name.trim(),
    last_name: values.last_name.trim(),
    email: values.email.trim() || null,
    date_of_birth: format(values.date_of_birth!, "yyyy-MM-dd"),
    default_hourly_rate:
      values.user_role === "student"
        ? parseFloat(values.default_hourly_rate)
        : undefined,
    user_role: values.user_role,
    signin_option: values.signin_option,
  };
}

const HAS_LETTER = /\p{L}/u; // any letter, including š, č, ć, ž, đ
const HOURLY_RATE_FORMAT = /^\d+(\.\d{1,2})?$/; // e.g. 8, 8.5, 8.56

// Mirrors the backend rules so the admin sees problems before the request is sent.
// Only fields with a problem get a key, so "no errors" is an empty object
export function validateForm(
  values: CreateUserFormValues,
): CreateUserFormErrors {
  const errors: CreateUserFormErrors = {};

  const firstName = values.first_name.trim();
  if (!firstName) {
    errors.first_name = "First name is required";
  } else if (!HAS_LETTER.test(firstName)) {
    errors.first_name = "First name must contain a letter";
  }

  const lastName = values.last_name.trim();
  if (!lastName) {
    errors.last_name = "Last name is required";
  } else if (!HAS_LETTER.test(lastName)) {
    errors.last_name = "Last name must contain a letter";
  }

  // Email is optional, unless the user sets up their account through an email link
  const email = values.email.trim();
  if (!email && values.signin_option === "email") {
    errors.email = "Email is required for the email setup link";
  } else if (email && !isValidEmail(email)) {
    errors.email = "Enter a valid email address";
  }

  // The date input only reports complete, valid dates of someone old enough,
  // and shows the detailed message itself - here we only check it's filled in
  if (!values.date_of_birth) {
    errors.date_of_birth = "Date of birth is required";
  }

  // Admins don't have an hourly rate
  if (values.user_role === "student") {
    const rate = values.default_hourly_rate.trim();
    if (!rate) {
      errors.default_hourly_rate = "Hourly rate is required";
    } else if (!HOURLY_RATE_FORMAT.test(rate)) {
      errors.default_hourly_rate = "Enter a number like 8.56";
    } else if (Number(rate) <= 0 || Number(rate) > MAX_HOURLY_RATE) {
      errors.default_hourly_rate = `Must be between 0 and ${MAX_HOURLY_RATE}`;
    }
  }

  return errors;
}

export function hasErrors(errors: CreateUserFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
