export function isValidCNPJ(cnpj: string): boolean {
  // Remover caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]+/g, "");

  // Verificar se o CNPJ possui 14 caracteres
  if (cnpj.length !== 14) {
    return false;
  }

  // Validar CNPJs conhecidos como inválidos
  if (
    /^(00000000000000|11111111111111|22222222222222|33333333333333|44444444444444|55555555555555|66666666666666|77777777777777|88888888888888|99999999999999)$/.test(
      cnpj
    )
  ) {
    return false;
  }

  // Validar o primeiro dígito verificador
  let soma = 0;
  let peso = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpj[i]) * peso[i];
  }
  let resto = soma % 11;
  let digito1 = resto < 2 ? 0 : 11 - resto;

  // Validar o segundo dígito verificador
  soma = 0;
  peso = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpj[i]) * peso[i];
  }
  resto = soma % 11;
  let digito2 = resto < 2 ? 0 : 11 - resto;

  // Verificar se os dígitos verificadores são iguais aos fornecidos
  if (digito1 === parseInt(cnpj[12]) && digito2 === parseInt(cnpj[13])) {
    return true;
  }
  return false;
}
