/**
 * Applies a Brazilian Real money mask to a string input
 * Format: R$ 1.234,56 (with thousands separator using dots and decimal separator using comma)
 * @param value - The input value to be masked
 * @returns The formatted money string with R$ prefix
 */
export function formatMoneyMask(value: string): string {
  // Remove all non-numeric characters except comma and dot
  let numericValue = value.replace(/[^\d,]/g, "");

  // If empty, return R$
  if (!numericValue) {
    return "";
  }

  // Handle comma for decimal places
  const parts = numericValue.split(",");
  let integerPart = parts[0];
  let decimalPart = parts[1];

  // Limit decimal places to 2
  if (decimalPart && decimalPart.length > 2) {
    decimalPart = decimalPart.substring(0, 2);
  }

  // Add thousands separators (dots) to integer part
  if (integerPart.length > 3) {
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Reconstruct the value
  let formattedValue = integerPart;
  if (parts.length > 1) {
    formattedValue += "," + (decimalPart || "");
  }

  return formattedValue;
}

/**
 * Removes money formatting and returns clean numeric string
 * @param value - The formatted money string
 * @returns Clean numeric string that can be parsed
 */
export function cleanMoneyValue(value: string): string {
  return value
    .replace(/[R$\s]/g, "") // Remove R$ and spaces
    .replace(/\./g, "") // Remove thousands separators
    .replace(",", "."); // Convert decimal comma to dot for parsing
}

/**
 * Parses a formatted money string to a number
 * @param value - The formatted money string
 * @returns The numeric value or 0 if invalid
 */
export function parseMoneyValue(value: string): number {
  const cleanValue = cleanMoneyValue(value);
  const numericValue = parseFloat(cleanValue);
  return isNaN(numericValue) ? 0 : numericValue;
}
