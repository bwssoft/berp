import { ICreateSaleOrderFromWebhookUseCase } from "../../../usecase/sale-order/@dto/create-sale-order-from-webhook.usecase.dto";
import { IDeleteSaleOrderFromWebhookUseCase } from "../../../usecase/sale-order/@dto/delete-sale-order-from-webhook.usecase.dto";
import { IUpdateSaleOrderFromWebhookUseCase } from "../../../usecase/sale-order/@dto/update-sale-order-from-webhook.usecase.dto";

export interface ISaleOrderFacade {
  createSaleOrderFromWebhookUseCase: ICreateSaleOrderFromWebhookUseCase;
  updateSaleOrderFromWebhookUseCase: IUpdateSaleOrderFromWebhookUseCase;
  deleteSaleOrderFromWebhookUseCase: IDeleteSaleOrderFromWebhookUseCase;
  createOneSaleOrderUsecase: any;
  deleteOneSaleOrderUsecase: any;
  findAllSaleOrderUsecase: any;
  findOneSaleOrderUsecase: any;
  updateOneSaleOrderUsecase: any;
}
