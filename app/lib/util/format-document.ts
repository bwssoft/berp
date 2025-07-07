export const formatCpf = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .slice(0, 14);

export const formatRg = (v: string) => {
  // Extract all numbers and the last character if it's a letter
  const numericPart = v.replace(/[^\d]/g, "");
  const lastChar = v.slice(-1);
  const isLastCharLetter = /[A-Za-z]/.test(lastChar);

  // Format with letter at the end if present
  if (isLastCharLetter) {
    const digitsOnly = v.replace(/[^\d]/g, "");

    if (digitsOnly.length >= 8) {
      return `${digitsOnly.slice(0, 2)}.${digitsOnly.slice(2, 5)}.${digitsOnly.slice(5, 8)}-${lastChar.toUpperCase()}`;
    }

    // Handle partial RG with letter
    if (digitsOnly.length >= 5) {
      return `${digitsOnly.slice(0, 2)}.${digitsOnly.slice(2, 5)}.${digitsOnly.slice(5)}-${lastChar.toUpperCase()}`;
    }

    if (digitsOnly.length >= 2) {
      return `${digitsOnly.slice(0, 2)}.${digitsOnly.slice(2)}-${lastChar.toUpperCase()}`;
    }

    return `${digitsOnly}-${lastChar.toUpperCase()}`;
  }

  // Standard formatting for numeric RG
  let formatted = numericPart;

  if (numericPart.length > 2) {
    formatted = numericPart.slice(0, 2) + "." + numericPart.slice(2);
  }

  if (numericPart.length > 5) {
    formatted = formatted.slice(0, 5) + "." + formatted.slice(5);
  }

  if (numericPart.length > 8) {
    formatted = formatted.slice(0, 9) + "-" + formatted.slice(9);
  }

  return formatted.slice(0, 12); // Limit to reasonable length
};

export const identifyDocumentType = (
  value: string
): "cpf" | "rg" | "unknown" => {
  // Remove non-alphanumeric characters
  const cleanedValue = value.replace(/\D/g, "");
  const lastChar = value.slice(-1);
  const isLastCharLetter = /[A-Za-z]/.test(lastChar);

  // Check for CPF - exactly 11 digits
  if (cleanedValue.length === 11 && !isLastCharLetter) {
    return "cpf";
  }

  // Check for RG - typically 8-9 digits, may end with a letter
  if (
    (cleanedValue.length >= 7 && cleanedValue.length <= 9) ||
    (isLastCharLetter && cleanedValue.length >= 7)
  ) {
    return "rg";
  }

  // If the input is still growing, make a best guess based on current length
  if (cleanedValue.length > 9) {
    return "cpf";
  } else if (cleanedValue.length > 0 || isLastCharLetter) {
    return "rg";
  }

  return "unknown";
};

export const formatDocument = (value: string): string => {
  const docType = identifyDocumentType(value);

  if (docType === "cpf") {
    return formatCpf(value);
  } else if (docType === "rg") {
    return formatRg(value);
  }

  return value;
};
