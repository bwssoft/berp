import { ISaleOrderFacade } from "@/app/lib/@backend/domain/sale-order/facade";
import {
  createOneSaleOrderUsecase,
  deleteOneSaleOrderUsecase,
  findAllSaleOrderUsecase,
  findOneSaleOrderUsecase,
  updateOneSaleOrderUsecase,
} from "..";

export class SaleOrderFacade {
  public static create(): ISaleOrderFacade {
    const facade: ISaleOrderFacade = {
      createOneSaleOrderUsecase,
      updateOneSaleOrderUsecase,
      deleteOneSaleOrderUsecase,
      findAllSaleOrderUsecase,
      findOneSaleOrderUsecase,
    };

    return facade;
  }
}
