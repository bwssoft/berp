export interface IClient {
  id?: string
  type: "prospect" |
  "inactive_registration" |
  "active_client" |
  "suspended_client" |
  "deregistered_cnpj" |
  "inactive_cnpj" |
  "dealer" |
  "other"
  corporate_name: string;
  sector: "vehicle_protection_association" |
  "retail_trade" |
  "tracking_company" |
  "service_company" |
  "vehicle_protection_manager" |
  "industry" |
  "integrator_ti" |
  "rental_company" |
  "logistics" |
  "iot_tracking_platform" |
  "resale" |
  "insurance_company" |
  "patrimonial_security" |
  "carrier" |
  "other"
  document: string
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
    phone: string
    name: string
    role: "analyst" |
    "supervisor" |
    "manager" |
    "director" |
    "president" |
    "owner"
    department: "administrative" |
    "commercial" |
    "purchasing" |
    "financial" |
    "logistics" |
    "operations" |
    "presidency" |
    "products" |
    "owner" |
    "support"
  }[]
  created_at: Date
  omie_metadata: {
    [key in OmieEnterprise]: string
  }
}

enum OmieEnterprise {
  MGC = "MGC",
  BWS = "BWS",
  ICB = "ICB",
  ICBFILIAL = "ICBFILIAL",
  WFC = "WFC",
}
