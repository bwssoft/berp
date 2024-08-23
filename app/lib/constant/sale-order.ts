import { ISaleOrder } from "../@backend/domain";
import { OmieSaleOrderStage } from "../@backend/domain/@shared/webhook/omie/omie-sale-order.webhook.interface";

//objeto para mapear o titulo dos cards nos insights dos forms de produto
type StageOmieMapped = Record<
  OmieSaleOrderStage,
  ISaleOrder["omie_webhook_metadata"]["stage"]
>;

const stageOmieMapped: StageOmieMapped = {
  "00": "proposal",
  "20": "stock",
  "50": "to_invoice",
  "60": "invoiced",
  "70": "shipment",
  "80": "awaiting_approval",
};

export const saleOrderConstants = {
  stageOmieMapped,
};
