import { IncluirPedidoVendaProduto } from "../../../infra/gateway/omie/@dto";

export interface IProposalOmiegateway {
  insertOne(props: IncluirPedidoVendaProduto
  ): Promise<void>
}