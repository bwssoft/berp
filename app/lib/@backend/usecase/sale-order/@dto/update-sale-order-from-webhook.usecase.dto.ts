import { UpdateResult } from "mongodb";
import { ISaleOrder } from "../../../domain/sale-order";
import { UpdateSaleOrderFromWebhookUseCaseInput } from "../webhook";

export interface IUpdateSaleOrderFromWebhookUseCase {
  execute: (
    data: UpdateSaleOrderFromWebhookUseCaseInput
  ) => Promise<UpdateResult<ISaleOrder> | undefined>;
}
