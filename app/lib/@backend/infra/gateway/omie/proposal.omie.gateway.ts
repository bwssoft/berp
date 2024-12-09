import { singleton } from "@/app/lib/util";
import { IncluirPedidoVendaProduto } from "./@dto";
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
