import { OmieEnterpriseEnum } from "../../@shared/gateway/omie.gateway.interface";
import { IContact } from "./contact.definition";

export interface IClient {
  id: string;
  company_name: string; //razao social
  trade_name: string; //nome fantasia
  document: Document
  sector?: ClientSector
  address?: Address;
  description?: string;
  bank_details?: BankDetails
  tax_details?: TaxDetails
  contacts: IContact[];
  created_at: Date;
  omie_metadata?: {
    codigo_cliente: Partial<Record<OmieEnterpriseEnum, number | undefined>>;
    codigo_cliente_integracao?: string
  }
}

export interface Document {
  value: string
  type?: "CPF" | "CNPJ";
};
interface TaxDetails {
  state_registration?: string;
  municipal_registration?: string;
  regime?: TaxRegime
}
interface BankDetails {
  code?: string // codigo do banco
  agency?: string
  account?: string
  pix?: string
  holder?: {
    document?: string
    name?: string
  }
}
export interface Address {
  street?: string;
  postal_code?: string;
  city?: string;
  state?: string;
  country?: string;
}
enum ClientSector {
  vehicle_protection_association = "vehicle_protection_association",
  retail_trade = "retail_trade",
  tracking_company = "tracking_company",
  service_company = "service_company",
  vehicle_protection_manager = "vehicle_protection_manager",
  industry = "industry",
  integrator_ti = "integrator_ti",
  rental_company = "rental_company",
  logistics = "logistics",
  iot_tracking_platform = "iot_tracking_platform",
  resale = "resale",
  insurance_company = "insurance_company",
  patrimonial_security = "patrimonial_security",
  carrier = "carrier",
  other = "other",
}

export enum TaxRegime {
  SIMPLES_NACIONAL = "SIMPLES_NACIONAL",
  LUCRO_PRESUMIDO = "LUCRO_PRESUMIDO",
  LUCRO_REAL = "LUCRO_REAL",
  MEI = "MEI",
  ISENTO = "ISENTO",
  PRODUTOR_RURAL = "PRODUTOR_RURAL",
  OUTRO = "Outro",
}

