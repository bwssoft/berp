import { OmieEnterpriseEnum } from "../../@shared/gateway/omie/omie.gateway.interface";

export interface IProposal {
  id: string;
  phase: 'negotiation' | 'proposal_sent' | 'accepted' | 'rejected';
  valid_at: Date;
  probability: number
  description?: string;
  billing_address: Address;
  delivery_address: Address;
  scenarios: Scenario[];
  user_id: string;
  client_id: string;
  billing_process?: BillingProcess[]
  created_at: Date
  documents: Document[]
}

interface Document {
  id: string
  scenario_id: string
  key: string
  name: string
  size: number
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
  freight?: {
    value: number
    type: FreightType
  };
  line_items: LineItem[];
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
  product_id: string
  quantity: number;
  unit_price: number;
  discount: number;
  total_price: number;
}



interface BillingProcess {
  id: string
  line_item_id: string[]
  billing_company: OmieEnterpriseEnum
  installment_quantity: number
  omie_sale_order_id?: string
}

interface SignatureProcess {
  id: string
  document_id: string
  contact_id: string[]
  is_fullish: boolean
  is_active: boolean
}
