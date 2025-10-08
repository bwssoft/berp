export type BrazilianUF =
  | "AC" // Acre
  | "AL" // Alagoas
  | "AP" // Amapá
  | "AM" // Amazonas
  | "BA" // Bahia
  | "CE" // Ceará
  | "DF" // Distrito Federal
  | "ES" // Espírito Santo
  | "GO" // Goiás
  | "MA" // Maranhão
  | "MT" // Mato Grosso
  | "MS" // Mato Grosso do Sul
  | "MG" // Minas Gerais
  | "PA" // Pará
  | "PB" // Paraíba
  | "PR" // Paraná
  | "PE" // Pernambuco
  | "PI" // Piauí
  | "RJ" // Rio de Janeiro
  | "RN" // Rio Grande do Norte
  | "RS" // Rio Grande do Sul
  | "RO" // Rondônia
  | "RR" // Roraima
  | "SC" // Santa Catarina
  | "SP" // São Paulo
  | "SE" // Sergipe
  | "TO"; // Tocantins

export interface IPriceTableCondition {
  id: string;
  billingLimit?: string;
  toBillFor: string;
  salesFor?: BrazilianUF[];
  priority?: boolean;
}

export interface IPriceTableConditionGroup {
  id?: string;
  conditions: IPriceTableCondition[];
  created_at?: Date;
  updated_at?: Date;
}
