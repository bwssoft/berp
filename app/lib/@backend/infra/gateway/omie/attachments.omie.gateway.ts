import { singleton } from "@/app/lib/util/singleton";
import type { IOmieAttachment } from "./@dto/attachment.dto";
import { OmieGateway } from "./@base";

class AttachmentOmieGateway extends OmieGateway {
  async findMany(idPedido: string) {
    const data = this.formatBody("ListarAnexo", {
      nId: idPedido,
      cTabela: "pedido-venda",
    });

    const response = await this._httpProvider.post<IOmieAttachment>(
      "/geral/anexo/",
      data
    );

    return response.data;
  }

  async getAttachmentUrl({
    attachmentId,
    attachmentName,
    domain,
    saleOrderId,
  }: {
    saleOrderId: string;
    domain: string;
    attachmentName: string;
    attachmentId: string;
  }) {
    try {
      const payload = this.formatBody("ObterAnexo", {
        cTabela: domain,
        nId: saleOrderId,
        nIdAnexo: attachmentId,
        cNomeArquivo: attachmentName,
      });

      const response = await this._httpProvider.post<{ cLinkDownload: string }>(
        "/geral/anexo/",
        payload
      );

      return response.data.cLinkDownload;
    } catch (error) {
      throw new Error(
        "Error on AttachmentOmieGateway, getAttachmentUrl method"
      );
    }
  }
}

export const attachmentOmieGateway = singleton(AttachmentOmieGateway);
