import { OmieEnterpriseEnum } from "../../@shared/gateway/omie.gateway.interface";

export interface IProposal {
  id: string
  description?: string
  billing_address?: Address
  delivery_address?: Address
  scenarios: Scenario[]
  user_id: string
  client_id: string
  created_at: Date
}

// reponsabilidades:
// 1. Saber o que o cliente quer
// 2. Assinatura
// 3. Liberar para o proximo processo

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
  signature_process?: SignatureProcess
  document?: Document[]
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
  enterprise_id: OmieEnterpriseEnum
  line_item_id: string[]
  installment_quantity?: number
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
  enterprise_id: string
}