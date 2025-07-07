/**
 * Applies a mask to a phone number based on its type
 * @param value - The input value to be masked
 * @param type - The type of contact (Celular, Telefone Residencial, Telefone Comercial)
 * @returns The formatted phone number
 */
export const maskPhoneNumber = (value: string, type?: string): string => {
  // Remove non-numeric characters
  const numericValue = value.replace(/\D/g, '');
  
  // Apply mask based on type
  if (type === 'Celular') {
    // Format: (00) 00000-0000
    if (numericValue.length <= 2) {
      return numericValue;
    } else if (numericValue.length <= 7) {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
    } else if (numericValue.length <= 11) {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
    }
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
  } else if (type === 'Telefone Residencial' || type === 'Telefone Comercial') {
    // Format: (00) 0000-0000
    if (numericValue.length <= 2) {
      return numericValue;
    } else if (numericValue.length <= 6) {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
    } else if (numericValue.length <= 10) {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 6)}-${numericValue.slice(6, 10)}`;
    }
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 6)}-${numericValue.slice(6, 10)}`;
  }
  
  // Return original value if no type match
  return value;
};

/**
 * Unmasks a formatted phone number to get just the digits
 * @param value - The masked phone number
 * @returns The phone number with only digits
 */
export const unmaskPhoneNumber = (value: string): string => {
  return value.replace(/\D/g, '');
};
