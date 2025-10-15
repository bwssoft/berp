import { IncluirPedidoVendaProduto } from "@/backend/infra/gateway/omie/@dto/sale-order.dto";

export interface IProposalOmiegateway {
  insertOne(props: IncluirPedidoVendaProduto
  ): Promise<void>
}
