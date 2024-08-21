import { ISaleOrder } from "../@backend/domain";
import {
  OmieSaleOrderStage,
  OmieSaleOrderStageDescription,
} from "../@backend/domain/@shared/gateway/omie/omie-sale-order.gateway.interface";

//objeto para mapear o titulo dos cards nos insights dos forms de produto
type StageOmieMapped = Record<
  ISaleOrder["omie_webhook_metadata"]["stage"],
  {
    etapa: OmieSaleOrderStage;
    etapaDescr: OmieSaleOrderStageDescription;
  }
>;

const stageOmieMapped: StageOmieMapped = {
  proposal: { etapa: "00", etapaDescr: "Proposta" },
  // proposal_budget: { etapa: "10", etapaDescr: "Proposta / Orçamento" },
  stock: { etapa: "20", etapaDescr: "Separar Estoque" },
  invoiced: { etapa: "60", etapaDescr: "Faturado" },
  shipment: { etapa: "70", etapaDescr: "Entrega" },
  to_invoice: { etapa: "50", etapaDescr: "Faturar" },
  awaiting_approval: {
    etapa: "80",
    etapaDescr: "Pedido/ Aprovação Financeira",
  },
};

export const saleOrderConstants = {
  stageOmieMapped,
};
