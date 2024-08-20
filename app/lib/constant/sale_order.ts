import { ISaleOrder } from "../@backend/domain";

//objeto para mapear o titulo dos cards nos insights dos forms de produto
type StageOmieMapped = Record<ISaleOrder["omie_webhook_metadata"]["stage"], {
  etapa: string //00
  etapaDescr: string //Proposta
}>

const stageOmieMapped: StageOmieMapped = {
  proposal: { etapa: "00", etapaDescr: "Proposta" },
  proposal_budget: { etapa: "10", etapaDescr: "Proposta / Orçamento" },
  stock: { etapa: "20", etapaDescr: "Separar Estoque" },
  invoiced: { etapa: "60", etapaDescr: "Faturado" },
  shipment: { etapa: "70", etapaDescr: "Entrega" },
  to_invoice: { etapa: "50", etapaDescr: "Faturar" },
  awaiting_approval: { etapa: "80", etapaDescr: "Aprovação Financeira" },
}

export const saleOrderConstants = {
  stageOmieMapped
}