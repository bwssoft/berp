export interface IClient {
  id: string;
  type:
    | "prospect"
    | "inactive_registration"
    | "active_client"
    | "suspended_client"
    | "deregistered_cnpj"
    | "inactive_cnpj"
    | "dealer"
    | "other";
  corporate_name: string;
  sector:
    | "vehicle_protection_association"
    | "retail_trade"
    | "tracking_company"
    | "service_company"
    | "vehicle_protection_manager"
    | "industry"
    | "integrator_ti"
    | "rental_company"
    | "logistics"
    | "iot_tracking_platform"
    | "resale"
    | "insurance_company"
    | "patrimonial_security"
    | "carrier"
    | "other";
  document: { type: "CPF" | "CNPJ"; value: string };
  state_registration: string;
  municipal_registration: string;
  billing_address: {
    street: string;
    postal_code: string;
    city: string;
    state: string;
    country: string;
  };
  description: string;
  contacts: {
    phone: string;
    name: string;
    role:
      | "analyst"
      | "supervisor"
      | "manager"
      | "director"
      | "president"
      | "owner";
    department:
      | "administrative"
      | "commercial"
      | "purchasing"
      | "financial"
      | "logistics"
      | "operations"
      | "presidency"
      | "products"
      | "owner"
      | "support";
  }[];
  created_at: Date;
  omie_code_metadata?: Record<keyof OmieEnterprise, string>;
}

export const clientTypeMapping: Record<IClient["type"], string> = {
  active_client: "Cliente ativo",
  dealer: "Concessionário",
  deregistered_cnpj: "CNPJ cancelado",
  inactive_cnpj: "CNPJ inativo",
  inactive_registration: "Cadastro inativo",
  other: "Outros",
  prospect: "Potencial cliente",
  suspended_client: "Cliente suspendido",
};

export const clientSectorMapping: Record<IClient["sector"], string> = {
  vehicle_protection_association: "Associação de proteção veicular",
  retail_trade: "Comércio varejista",
  tracking_company: "Empresa de rastreamento",
  service_company: "Empresa de serviços",
  vehicle_protection_manager: "Gestor de proteção veicular",
  industry: "Indústria",
  integrator_ti: "Integrações de TI",
  rental_company: "Empresa de locadora",
  logistics: "Logística",
  iot_tracking_platform: "Plataforam de rastreamento IoT",
  resale: "Revenda",
  insurance_company: "Seguradora",
  patrimonial_security: "Segurança patrimonial",
  carrier: "Transportadora",
  other: "Outro",
};

export enum OmieEnterprise {
  MGC = "MGC",
  BWS = "BWS",
  ICB = "ICB",
  ICBFILIAL = "ICBFILIAL",
  WFC = "WFC",
}
