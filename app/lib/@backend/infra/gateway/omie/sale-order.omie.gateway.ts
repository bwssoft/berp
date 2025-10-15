import { singleton } from "@/app/lib/util/singleton";
import { OmieGateway } from "./@base";
import { OmieSaleOrderStage } from "@/backend/domain/@shared/webhook/omie/omie-sale-order.webhook.interface";

class SaleOrderOmieGateway extends OmieGateway {
  async updateStage(saleOrderId: string, statusId: OmieSaleOrderStage) {
    const data = this.formatBody("TrocarEtapaPedido", {
      codigo_pedido: Number(saleOrderId),
      etapa: statusId,
    });

    await this._httpProvider.post<void>("/produtos/pedido/", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export const saleOrderOmieGateway = singleton(SaleOrderOmieGateway);

