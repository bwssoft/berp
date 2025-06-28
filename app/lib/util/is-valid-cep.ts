export function isValidCEP(cep: string): boolean {
    return /^[0-9]{5}-?[0-9]{3}$/.test(cep);
}
