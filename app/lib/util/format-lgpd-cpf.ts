interface LgpdPermissions {
  fullLgpdAccess?: boolean;
  partialLgpdAccess?: boolean;
}

/**
 * Formats CPF with LGPD masking based on user permissions
 * @param cpf - The CPF string (11 digits, no formatting)
 * @param permissions - Object containing LGPD access permissions
 * @returns Formatted CPF string with appropriate masking
 */
export const formatLgpdCpf = (
  cpf: string,
  permissions: LgpdPermissions = {}
): string => {
  const { fullLgpdAccess, partialLgpdAccess } = permissions;

  // Remove any existing formatting to ensure we have clean digits
  const cleanCpf = cpf.replace(/\D/g, "");

  // Validate CPF length
  if (cleanCpf.length !== 11) {
    return "***.***.***-**"; // Return fully masked for invalid CPF
  }

  if (fullLgpdAccess) {
    // Format as CPF with full visibility (000.000.000-00)
    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (partialLgpdAccess) {
    // Mask middle digits (format: 052.***.***.77)
    const firstThree = cleanCpf.substring(0, 3);
    const lastTwo = cleanCpf.substring(9, 11);
    return `${firstThree}.***.***.${lastTwo}`;
  } else {
    // No permission - show fully masked
    return "***.***.***-**";
  }
};
