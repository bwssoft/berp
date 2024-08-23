import { OmieSaleOrderEvents } from "../../@shared/webhook/omie/omie-sale-order.webhook.interface";

export interface ISaleOrderController {
  execute: (
    data: OmieSaleOrderEvents[keyof OmieSaleOrderEvents]
  ) => Promise<void>;
}
