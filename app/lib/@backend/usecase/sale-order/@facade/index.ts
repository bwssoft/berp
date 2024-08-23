import { ISaleOrderFacade } from "@/app/lib/@backend/domain/sale-order/facade";
import {
  createOneSaleOrderUsecase,
  createSaleOrderFromWebhookUseCase,
  deleteOneSaleOrderUsecase,
  deleteSaleOrderFromWebhookUseCase,
  findAllSaleOrderUsecase,
  findOneSaleOrderUsecase,
  updateOneSaleOrderUsecase,
  updateSaleOrderFromWebhookUseCase,
} from "..";

export class SaleOrderFacade {
  public static create(): ISaleOrderFacade {
    const facade: ISaleOrderFacade = {
      createSaleOrderFromWebhookUseCase,
      deleteSaleOrderFromWebhookUseCase,
      updateSaleOrderFromWebhookUseCase,
      createOneSaleOrderUsecase,
      updateOneSaleOrderUsecase,
      deleteOneSaleOrderUsecase,
      findAllSaleOrderUsecase,
      findOneSaleOrderUsecase,
    };

    return facade;
  }
}
