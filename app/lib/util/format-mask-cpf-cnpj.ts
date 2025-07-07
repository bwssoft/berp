export function maskCpfCnpj(value: string): string {
  // Remove todos os caracteres não numéricos
  const digits = value.replace(/\D/g, "");

  // Limita a 14 dígitos (tamanho máximo de um CNPJ)
  const limitedDigits = digits.slice(0, 14);

  // Verifica se é CPF ou CNPJ baseado no número de dígitos
  if (limitedDigits.length <= 11) {
    // Formata como CPF: 123.456.789-01
    let result = limitedDigits;

    if (limitedDigits.length > 3) {
      result = limitedDigits.substring(0, 3) + "." + limitedDigits.substring(3);
    }

    if (limitedDigits.length > 6) {
      result = result.substring(0, 7) + "." + result.substring(7);
    }

    if (limitedDigits.length > 9) {
      result = result.substring(0, 11) + "-" + result.substring(11);
    }

    return result;
  } else {
    // Formata como CNPJ: 12.345.678/0001-99
    let result = limitedDigits;

    if (limitedDigits.length > 2) {
      result = limitedDigits.substring(0, 2) + "." + limitedDigits.substring(2);
    }

    if (limitedDigits.length > 5) {
      result = result.substring(0, 6) + "." + result.substring(6);
    }

    if (limitedDigits.length > 8) {
      result = result.substring(0, 10) + "/" + result.substring(10);
    }

    if (limitedDigits.length > 12) {
      result = result.substring(0, 15) + "-" + result.substring(15);
    }

    return result;
  }
}
