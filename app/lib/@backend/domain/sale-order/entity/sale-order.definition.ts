export interface ISaleOrder {
  id: string;
  client_id: string;
  products: { product_id: string; quantity: number }[];
  created_at: Date;
  omie_webhook_metadata: {
    client_id: string; //idCliente
    order_id: string; //idPedido
    order_number: string; //numeroPedido 329
    value: number; //valorPedido 2.54
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
