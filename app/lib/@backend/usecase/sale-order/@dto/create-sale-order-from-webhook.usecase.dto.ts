import { InsertOneResult } from "mongodb";
import { ISaleOrder } from "../../../domain/sale-order";
import { CreateSaleOrderFromWebhookUseCaseInput } from "../webhook";

export interface ICreateSaleOrderFromWebhookUseCase {
  execute: (
    data: CreateSaleOrderFromWebhookUseCaseInput
  ) => Promise<InsertOneResult<ISaleOrder> | undefined>;
}
