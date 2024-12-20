import { OmieEnterpriseEnum } from "../../@shared/gateway/omie/omie.gateway.interface";

export interface ISaleOrder {
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
