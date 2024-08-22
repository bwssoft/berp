export type OmieSaleOrderStage = "00" | "20" | "60" | "70" | "50" | "80";

export type OmieSaleOderTopics =
  | "VendaProduto.Incluida"
  | "VendaProduto.Alterada"
  | "VendaProduto.Excluida"
  | "VendaProduto.EtapaAlterada"
  | "VendaProduto.Cancelada";

export type OmieSaleOrderStageDescription =
  | "Proposta"
  | "Separar Estoque"
  | "Faturado"
  | "Entrega"
  | "Faturar"
  | "Pedido/ Aprovação Financeira";

export type OmieSaleOrderEventPayload<
  Topic extends OmieSaleOderTopics,
  EventPayload
> = {
  messageId: string;
  topic: Topic;
  event: EventPayload;
  author: {
    email: string;
    name: string;
    userId: number;
  };
  appKey: string;
  appHash: string;
  origin: string;
};

type VendaProdutoIncluidaEvent = {
  codIntPedido: string;
  codigoCategoria: string;
  dataInclusao: string;
  dataPrevisao: string;
  etapa: "00";
  etapaDescr: "Proposta";
  horaInclusao: string;
  idCliente: number;
  idContaCorrente: number;
  idPedido: number;
  numeroPedido: string;
  usuarioInclusao: string;
  valorPedido: number;
};

type VendaProdutoAlteradaEvent = {
  codIntPedido: string;
  codigoCategoria: string;
  dataAlteracao: string;
  dataPrevisao: string;
  etapa: OmieSaleOrderStage;
  etapaDescr: OmieSaleOrderStageDescription;
  horaAlteracao: string;
  idCliente: number;
  idContaCorrente: number;
  idPedido: number;
  numeroPedido: string;
  usuarioAlteracao: string;
  valorPedido: number;
};

type VendaProdutoEtapaAlteradaEvent = {
  codIntPedido: string;
  codigoCategoria: string;
  dataPrevisao: string;
  etapa: OmieSaleOrderStage;
  etapaDescr: OmieSaleOrderStageDescription;
  idCliente: number;
  idContaCorrente: number;
  idPedido: number;
  numeroPedido: string;
  valorPedido: number;
};

type VendaProdutoExcluidaEvent = {
  codIntPedido: string;
  codigoCategoria: string;
  dataPrevisao: string;
  etapa: OmieSaleOrderStage;
  etapaDescr: OmieSaleOrderStageDescription;
  idCliente: number;
  idContaCorrente: number;
  idPedido: number;
  numeroPedido: string;
  valorPedido: number;
};

type VendaProdutoCanceladaEvent = {
  cancelada: "S" | "N";
  codIntPedido: string;
  codigoCategoria: string;
  dataCancelado: string;
  dataPrevisao: string;
  etapa: OmieSaleOrderStage;
  etapaDescr: OmieSaleOrderStageDescription;
  horaCancelado: string;
  idCliente: number;
  idContaCorrente: number;
  idPedido: number;
  numeroPedido: string;
  usuarioCancelado: string;
  valorPedido: number;
};

export interface OmieSaleOrderEvents {
  "VendaProduto.Incluida": OmieSaleOrderEventPayload<
    "VendaProduto.Incluida",
    VendaProdutoIncluidaEvent
  >;

  "VendaProduto.Alterada": OmieSaleOrderEventPayload<
    "VendaProduto.Alterada",
    VendaProdutoAlteradaEvent
  >;

  "VendaProduto.EtapaAlterada": OmieSaleOrderEventPayload<
    "VendaProduto.EtapaAlterada",
    VendaProdutoEtapaAlteradaEvent
  >;

  "VendaProduto.Cancelada": OmieSaleOrderEventPayload<
    "VendaProduto.Cancelada",
    VendaProdutoCanceladaEvent
  >;

  "VendaProduto.Excluida": OmieSaleOrderEventPayload<
    "VendaProduto.Excluida",
    VendaProdutoExcluidaEvent
  >;
}
