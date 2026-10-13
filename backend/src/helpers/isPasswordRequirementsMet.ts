export function isPasswordRequirementsMet(
  password: string,
  type: "reset" | "update",
  currentPassword?: string,
) {
  const trimedPassword = password.trim();

  const requirements = [
    { met: trimedPassword.length >= 8, message: "At least 8 characters" },
    { met: /\d/.test(trimedPassword), message: "At least 1 number" },
  ];
  if (type === "update" && currentPassword) {
    requirements.push({
      met: trimedPassword !== "" && trimedPassword !== currentPassword.trim(),
      message: "New password must be different from current password",
    });
  }

  return {
    isRequirementsMet: requirements.every((requirement) => requirement.met),
    requirements,
  };
}
