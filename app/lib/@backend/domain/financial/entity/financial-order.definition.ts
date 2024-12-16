import { OmieEnterpriseEnum } from "../../@shared/gateway/omie.gateway.interface";

export interface IFinancialOrder {
  id: string;
  client_id: string;
  proposal_id: string | undefined
  line_items: LineItem[]
  line_items_processed: LineItemProcessed[]
  created_at: Date;



  //legacy
  active: boolean;
  products: { product_id: string; quantity: number }[];
  omie_webhook_metadata: {
    client_id: string; //idCliente
    order_id: string; //idPedido
    order_number: string; //numeroPedido 329
    vendor_id: string;
    vendor_name: string;
    value: number; //valorPedido 2.54
    enterprise: keyof typeof OmieEnterpriseEnum; //EMPRESA
    files: {
      file_name: string; //cNomeArquivo
      domain: string; //cTabela
      order_id: string; //nId
      attachment_id: string; //nIdAnexo
    }[];
    stage:
    | "proposal"
    // | "proposal_budget"
    | "awaiting_approval"
    | "stock"
    | "to_invoice"
    | "invoiced"
    | "shipment";
  };
}

export interface LineItemProcessed {
  enterprise_id: string
  items: LineItem[]
  installment_quantity: number | null
  installment: Installment[] | null
}

export interface LineItem {
  id: string,
  negotiation_type_id: string
  product_id: string
  quantity: number
  unit_price: number
  discount: number
  total_price: number
}

interface Installment {
  id: string
  value: number
  valid_at: Date
  percentage: number
  sequence: number
}




interface ISaleOrder {
  id: string;
  client_id: string;
  active: boolean;
  products: { product_id: string; quantity: number }[];
  created_at: Date;
  omie_webhook_metadata: {
    client_id: string; //idCliente
    order_id: string; //idPedido
    order_number: string; //numeroPedido 329
    vendor_id: string;
    vendor_name: string;
    value: number; //valorPedido 2.54
    enterprise: keyof typeof OmieEnterpriseEnum; //EMPRESA
    files: {
      file_name: string; //cNomeArquivo
      domain: string; //cTabela
      order_id: string; //nId
      attachment_id: string; //nIdAnexo
    }[];
    stage:
    | "proposal"
    // | "proposal_budget"
    | "awaiting_approval"
    | "stock"
    | "to_invoice"
    | "invoiced"
    | "shipment";
  };
}

export const saleOrderStageMapping: Record<
  ISaleOrder["omie_webhook_metadata"]["stage"],
  string
> = {
  awaiting_approval: "Aguardando aprovação",
  invoiced: "Faturado",
  proposal: "Proposta",
  shipment: "Expedido",
  stock: "Estoque",
  to_invoice: "À faturar",
};
