import { singleton } from "@/app/lib/util";
import { OmieGateway } from "./omie.gateway";

class AttachmentOmieGateway extends OmieGateway {
  async findAll(idPedido: string) {
    const data = this.formatBody("ListarAnexo", {
      nId: idPedido,
      cTabela: "pedido-venda",
    });

    const response = await this._httpProvider.post<any>("/geral/anexo/", data);

    return response.data;
  }
}

export const attachmentOmieGateway = singleton(AttachmentOmieGateway);
