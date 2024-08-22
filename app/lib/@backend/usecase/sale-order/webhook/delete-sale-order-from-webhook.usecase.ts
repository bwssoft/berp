import { singleton } from "@/app/lib/util/singleton";
import { OmieSaleOrderEvents } from "../../../domain/@shared/webhook/omie/omie-sale-order.webhook.interface";
import { deleteOneSaleOrderUsecase } from "../delete-one-sale-order.usecase";
import { findOneSaleOrderUsecase } from "../find-one-sale-order.usecase";

interface DeleteSaleOrderFromWebhookInput {
  body: OmieSaleOrderEvents["VendaProduto.Excluida"];
}

class DeleteSaleOrderFromWebhook {
  async execute(input: DeleteSaleOrderFromWebhookInput) {
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

export const deleteSaleOrderFromWebhook = singleton(DeleteSaleOrderFromWebhook);
