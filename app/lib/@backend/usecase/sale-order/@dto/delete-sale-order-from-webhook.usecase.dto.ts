import { DeleteSaleOrderFromWebhookUseCaseInput } from "../webhook";

export interface IDeleteSaleOrderFromWebhookUseCase {
  execute: (data: DeleteSaleOrderFromWebhookUseCaseInput) => Promise<void>;
}
