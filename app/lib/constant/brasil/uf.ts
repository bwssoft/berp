// @static – UFs não mudam (26 + DF)
export type UF_CODES =
  | "AC"
  | "AL"
  | "AP"
  | "AM"
  | "BA"
  | "CE"
  | "DF"
  | "ES"
  | "GO"
  | "MA"
  | "MT"
  | "MS"
  | "MG"
  | "PA"
  | "PB"
  | "PR"
  | "PE"
  | "PI"
  | "RJ"
  | "RN"
  | "RS"
  | "RO"
  | "RR"
  | "SC"
  | "SP"
  | "SE"
  | "TO";

export type UF = { uf: UF_CODES; nome: string; ibge: number };

export const UF_LIST: UF[] = [
  { uf: "AC", nome: "Acre", ibge: 12 },
  { uf: "AL", nome: "Alagoas", ibge: 27 },
  { uf: "AP", nome: "Amapá", ibge: 16 },
  { uf: "AM", nome: "Amazonas", ibge: 13 },
  { uf: "BA", nome: "Bahia", ibge: 29 },
  { uf: "CE", nome: "Ceará", ibge: 23 },
  { uf: "DF", nome: "Distrito Federal", ibge: 53 },
  { uf: "ES", nome: "Espírito Santo", ibge: 32 },
  { uf: "GO", nome: "Goiás", ibge: 52 },
  { uf: "MA", nome: "Maranhão", ibge: 21 },
  { uf: "MT", nome: "Mato Grosso", ibge: 51 },
  { uf: "MS", nome: "Mato Grosso do Sul", ibge: 50 },
  { uf: "MG", nome: "Minas Gerais", ibge: 31 },
  { uf: "PA", nome: "Pará", ibge: 15 },
  { uf: "PB", nome: "Paraíba", ibge: 25 },
  { uf: "PR", nome: "Paraná", ibge: 41 },
  { uf: "PE", nome: "Pernambuco", ibge: 26 },
  { uf: "PI", nome: "Piauí", ibge: 22 },
  { uf: "RJ", nome: "Rio de Janeiro", ibge: 33 },
  { uf: "RN", nome: "Rio Grande do Norte", ibge: 24 },
  { uf: "RS", nome: "Rio Grande do Sul", ibge: 43 },
  { uf: "RO", nome: "Rondônia", ibge: 11 },
  { uf: "RR", nome: "Roraima", ibge: 14 },
  { uf: "SC", nome: "Santa Catarina", ibge: 42 },
  { uf: "SP", nome: "São Paulo", ibge: 35 },
  { uf: "SE", nome: "Sergipe", ibge: 28 },
  { uf: "TO", nome: "Tocantins", ibge: 17 },
];
