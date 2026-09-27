export function formatPhone(str: string) {
  const formatStr = str.replace(/\D/g, "");
  const match = formatStr.match(/^(\d{3})(\d{3})(\d{4})$/);

  return match ? `${match[1]}-${match[2]}-${match[3]}` : null;
}
