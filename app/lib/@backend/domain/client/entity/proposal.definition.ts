import { OmieEnterpriseEnum } from "../../@shared/gateway/omie/omie.gateway.interface";

export interface IProposal {
  id: string
  description?: string
  billing_address?: Address
  delivery_address?: Address
  scenarios: Scenario[]
  user_id: string
  client_id: string
  created_at: Date
  billing_process?: {
    [scenario_id: string]: BillingProcess[]
  }
  signature_process?: {
    [scenario_id: string]: SignatureProcess
  }
  document?: {
    [scenario_id: string]: Document[]
  }
}

interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface Scenario {
  id: string
  name: string;
  description?: string;
  currency: Currency;
  product_total: number;
  discount_value: number;
  subtotal_with_discount: number;
  grand_total: number;
  line_items: LineItem[];
  freight?: {
    value: number
    type: FreightType
  };
}

export enum Currency {
  BRL = 'BRL',
  USD = 'USD',
  EUR = 'EUR',
}

export enum FreightType {
  Correios = "Correios",
  MedeirosRodoviario = "MedeirosRodoviario",
  Motoboy = "Motoboy",
  PlaceAereo = "PlaceAereo",
  PlaceRodoviario = "PlaceRodoviario",
  Retira = "Retira",
  Outros = "Outros",
  AviatAereo = "AviatAereo",
  AviatRodoviario = "AviatRodoviario",
}

interface LineItem {
  id: string
  negotiation_type_id: string
  product_id: string
  quantity: number;
  unit_price: number;
  discount: number;
  total_price: number;
}

interface BillingProcess {
  id: string
  omie_enterprise: OmieEnterpriseEnum
  line_item_id: string[]
  installment_quantity?: number
  omie_sale_order_id?: string
}

interface SignatureProcess {
  id: string
  document_id: string[]
  contact: {
    id: string
    signed: boolean,
    seen: boolean,
    sent: boolean
    requested: boolean
  }[]
}

interface Document {
  id: string
  key: string
  name: string
  size: number
  omie_enterprise: OmieEnterpriseEnum
}