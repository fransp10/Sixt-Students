export type OnboardingStatus =
  | "deactivated"
  | "not_signed_in"
  | "no_requests"
  | "active";

export type RecentStudent = {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  created_at: string;
  onboarding_status: OnboardingStatus;
};
