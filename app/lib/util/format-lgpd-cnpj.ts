interface LgpdPermissions {
  fullLgpdAccess?: boolean;
  partialLgpdAccess?: boolean;
}

/**
 * Formats CNPJ with LGPD masking based on user permissions
 * @param cnpj - The CNPJ string (14 digits, no formatting)
 * @param permissions - Object containing LGPD access permissions
 * @returns Formatted CNPJ string with appropriate masking
 */
export const formatLgpdCnpj = (
  cnpj: string,
  permissions: LgpdPermissions = {}
): string => {
  const { fullLgpdAccess, partialLgpdAccess } = permissions;

  // Remove any existing formatting to ensure we have clean digits
  const cleanCnpj = cnpj.replace(/\D/g, "");

  // Validate CNPJ length
  if (cleanCnpj.length !== 14) {
    return "**.***.***/****-**"; // Return fully masked for invalid CNPJ
  }

  if (fullLgpdAccess) {
    // Format as CNPJ with full visibility (00.000.000/0000-00)
    return cleanCnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  } else if (partialLgpdAccess) {
    // Mask middle digits of CNPJ (format: 12.***.***/****.55)
    const firstTwo = cleanCnpj.substring(0, 2);
    const lastTwo = cleanCnpj.substring(12, 14);
    return `${firstTwo}.***.***/****-${lastTwo}`;
  } else {
    // No permission - show fully masked CNPJ
    return "**.***.***/****-**";
  }
};
