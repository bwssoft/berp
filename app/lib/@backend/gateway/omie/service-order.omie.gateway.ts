import { singleton } from "@/app/lib/util";
import { OmieGateway } from "./omie.gateway";

class SaleOrderOmieGateway extends OmieGateway {
  async find(codigo_pedido: string) {
    const data = this.formatBody("ConsultarPedido", {
      codigo_pedido,
    });

    const response = await this._httpProvider.post<any>(
      "/produtos/pedido/",
      data
    );

    return response.data;
  }
}

export const saleOrderOmieGateway = singleton(SaleOrderOmieGateway);
