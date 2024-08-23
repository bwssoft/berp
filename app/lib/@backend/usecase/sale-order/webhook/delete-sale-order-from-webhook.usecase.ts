import { singleton } from "@/app/lib/util/singleton";
import { OmieSaleOrderEvents } from "../../../domain/@shared/webhook/omie/omie-sale-order.webhook.interface";
import {
  deleteOneSaleOrderUsecase,
  findOneSaleOrderUsecase,
} from "../sale-order";

export interface DeleteSaleOrderFromWebhookUseCaseInput {
  body: OmieSaleOrderEvents["VendaProduto.Excluida"];
}

class DeleteSaleOrderFromWebhookUseCase {
  async execute(input: DeleteSaleOrderFromWebhookUseCaseInput) {
    const body = input.body;

    const { idPedido } = body.event;

    const stringifiedSaleOrderId = idPedido.toString();

    const saleOrderToDelete = await findOneSaleOrderUsecase.execute({
      "omie_webhook_metadata.order_id": stringifiedSaleOrderId,
    });

    if (saleOrderToDelete) {
      deleteOneSaleOrderUsecase.execute({ id: saleOrderToDelete.id });
    }
  }
}

export const deleteSaleOrderFromWebhookUseCase = singleton(
  DeleteSaleOrderFromWebhookUseCase
);
