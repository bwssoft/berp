import { singleton } from "@/app/lib/util";
import { OmieSaleOrderStage } from "../../domain/@shared/webhook/omie/omie-sale-order.webhook.interface";
import { IncluirPedidoVendaProduto } from "./@dto";
import { OmieGateway } from "./@base";

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

  async insertOne(props: IncluirPedidoVendaProduto) {
    const data = this.formatBody("IncluirPedido", props);

    await this._httpProvider.post<void>("/produtos/pedido/", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export const saleOrderOmieGateway = singleton(SaleOrderOmieGateway);
