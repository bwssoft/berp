import { singleton } from "@/app/lib/util/singleton";
import type { IncluirPedidoVendaProduto } from "./@dto/sale-order.dto";
import { OmieGateway } from "./@base";

class ProposalOmieGateway extends OmieGateway {
  async insertOne(props: IncluirPedidoVendaProduto) {
    const data = this.formatBody("IncluirPedido", props);

    await this._httpProvider.post<void>("/produtos/pedido/", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export const proposalOmieGateway = singleton(ProposalOmieGateway);
