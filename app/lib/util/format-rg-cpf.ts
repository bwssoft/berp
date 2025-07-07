export function formatRg(value: string) {
  // Remove all non-alphanumeric characters
  const sanitized = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  // Check if the format starts with letters (UF-99.999.999 format)
  // Brazilian state abbreviations are always 2 letters
  const startsWithLetters = /^[A-Z]/.test(sanitized);

  // Handle UF-99.999.999 format
  if (startsWithLetters) {
    const letters = sanitized.match(/^[A-Z]+/)?.[0] || "";
    const stateAbbr = letters.slice(0, 2); // Get up to 2 letters for state abbreviation
    const numbers = sanitized.replace(/^[A-Z]+/, "").slice(0, 9); // Get numbers after letters

    if (stateAbbr) {
      // Start with the state abbreviation
      let formattedRg = stateAbbr;

      // Add the dash and numbers if available
      if (numbers.length > 0) {
        formattedRg += "-";

        // Format as UF-99.999.999
        if (numbers.length <= 2) {
          formattedRg += numbers;
        } else if (numbers.length <= 5) {
          formattedRg += `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
        } else {
          formattedRg += `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}`;
        }
      }

      return formattedRg;
    }
  }

  // Default 99.999.999-9 format (all numeric)
  const numbers = sanitized.replace(/[A-Z]/g, "").slice(0, 9);

  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 5) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  } else if (numbers.length <= 8) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  } else {
    // Complete format with verification digit: 99.999.999-9
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}-${numbers.slice(8, 9)}`;
  }
}

export function formatCpf(value: string) {
  const raw = value.replace(/\D/g, "").slice(0, 11);
  if (raw.length <= 3) return raw;
  if (raw.length <= 6) return raw.replace(/^(\d{3})(\d{1,3})$/, "$1.$2");
  if (raw.length <= 9)
    return raw.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3");
  return raw.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
}

export function formatRgOrCpf(value: string) {
  const raw = value.replace(/\D/g, "");
  if (raw.length > 9) {
    return formatCpf(value);
  }
  return formatRg(value);
}
