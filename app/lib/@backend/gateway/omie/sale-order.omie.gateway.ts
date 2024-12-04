import { singleton } from "@/app/lib/util";
import { OmieSaleOrderStage } from "../../domain/@shared/webhook/omie/omie-sale-order.webhook.interface";
import { IncluirPedidoVendaProduto, IOmieSaleOrder } from "./@dto";
import { OmieGateway } from "./@base";

class SaleOrderOmieGateway extends OmieGateway {
  async find(codigo_pedido: string) {
    const data = this.formatBody("ConsultarPedido", {
      codigo_pedido,
    });

    const response = await this._httpProvider.post<IOmieSaleOrder>(
      "/produtos/pedido/",
      data
    );

    return response.data;
  }

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
