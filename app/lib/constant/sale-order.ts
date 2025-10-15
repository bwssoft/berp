import { IFinancialOrder } from "@/backend/domain/financial/entity/financial-order.definition";
import { OmieSaleOrderStage } from "@/backend/domain/@shared/webhook/omie/omie-sale-order.webhook.interface";

//objeto para mapear o titulo dos cards nos insights dos forms de produto
type StageOmieMapped = Record<
  OmieSaleOrderStage,
  IFinancialOrder["omie_webhook_metadata"]["stage"]
>;

const stageOmieMapped: StageOmieMapped = {
  "00": "proposal",
  "20": "stock",
  "50": "to_invoice",
  "60": "invoiced",
  "70": "shipment",
  "80": "awaiting_approval",
};

const financialOrderIntallment = [
  { id: 1, label: "À vista", value: 1 },
  { id: 2, label: "2 Parcelas", value: 2 },
  { id: 3, label: "3 Parcelas", value: 3 },
  { id: 4, label: "4 Parcelas", value: 4 },
  { id: 5, label: "5 Parcelas", value: 5 },
  { id: 6, label: "6 Parcelas", value: 6 },
  { id: 7, label: "7 Parcelas", value: 7 },
  { id: 8, label: "8 Parcelas", value: 8 },
  { id: 9, label: "9 Parcelas", value: 9 },
  { id: 10, label: "10 Parcelas", value: 10 },
  { id: 11, label: "11 Parcelas", value: 11 },
  { id: 12, label: "12 Parcelas", value: 12 },
]


export const saleOrderConstants = {
  stageOmieMapped,
  financialOrderIntallment
};
