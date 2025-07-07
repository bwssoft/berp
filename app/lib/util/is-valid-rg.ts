export function isValidRG(rg: string): boolean {
  // Remove non-alphanumeric characters
  const cleaned = rg.replace(/[^\w]/g, "");

  // RGs in Brazil vary by state, but generally have 8-9 digits
  // Some states use letters at the end
  if (cleaned.length < 8 || cleaned.length > 10) {
    return false;
  }

  // Basic validation: RG should have at least 7-8 numeric digits
  // If the last character is a letter, it's likely a verification digit
  const numericPart = cleaned.replace(/[A-Za-z]/g, "");
  if (numericPart.length < 7) {
    return false;
  }

  return true;
}
