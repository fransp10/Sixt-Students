export function isPasswordRequirementsMet(
  password: string,
  mode?: "change" | "reset",
  confirmPassword?: string,
  currentPassword?: string,
): {
  isRequirementsMet: boolean;
  requirements: { label: string; met: boolean }[];
} {
  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    {
      label: "Both passwords match",
      met: password === confirmPassword && password !== "",
    },
  ];

  if (mode === "change") {
    requirements.push({
      label: "Different from your current password",
      met: password !== "" && !!currentPassword && password !== currentPassword,
    });
  }
  return {
    isRequirementsMet: requirements.every((requirement) => requirement.met),
    requirements,
  };
}
