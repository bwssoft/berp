import { ISaleOrderController } from "@/app/lib/@backend/domain/sale-order/controller/sale-order.controller";
import { ISaleOrderFacade } from "@/app/lib/@backend/domain/sale-order/facade";
import {
  OmieSaleOderTopics,
  OmieSaleOrderEvents,
} from "../../domain/@shared/webhook/omie/omie-sale-order.webhook.interface";
import { SaleOrderFacade } from "../../usecase/sale-order/@facade";
import { SaleOrderOmieSchema } from "./sale-order.validator";

export class SaleOrderController implements ISaleOrderController {
  private readonly saleOrderFacade: ISaleOrderFacade;

  constructor() {
    this.saleOrderFacade = SaleOrderFacade.create();
  }

  public async execute(
    data: OmieSaleOrderEvents[keyof OmieSaleOrderEvents]
  ): Promise<void> {
    const topicEvent = data.topic;

    const objectEvent = await SaleOrderOmieSchema.safeParseAsync(data);

    if (!objectEvent.success) {
      console.log(objectEvent.error);
      throw new Error("Error parsing sale order schema from OMIE event.");
    }

    const keySaleOrderFacade = this.getUseCase(topicEvent);

    const useCase = this.saleOrderFacade[keySaleOrderFacade];

    await useCase.execute({ body: data });
  }

  private getUseCase(topic: OmieSaleOderTopics): keyof ISaleOrderFacade {
    let useCase: ISaleOrderFacade[keyof ISaleOrderFacade];

    if (topic === "VendaProduto.Incluida") {
      useCase = "createSaleOrderFromWebhookUseCase";
      return useCase;
    }

    if (topic === "VendaProduto.Excluida") {
      useCase = "deleteSaleOrderFromWebhookUseCase";
      return useCase;
    }

    useCase = "updateSaleOrderFromWebhookUseCase";

    return useCase;
  }
}
