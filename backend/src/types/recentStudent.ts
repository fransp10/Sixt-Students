export type onboardingStatus =
  | "deactivated"
  | "not_signed_in"
  | "no_requests"
  | "active";

export type recentStudent = {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  created_at: string;
  onboarding_status: onboardingStatus;
};
