import { OmieEnterpriseEnum } from "../../domain/@shared/gateway/omie/omie.gateway.interface";
import { OmieGateway } from "../../gateway/omie/base.gateway";

class AttachmentsOmieService {
  private _omieGateway: OmieGateway;

  constructor() {
    this._omieGateway = new OmieGateway();
  }

  setSecrets(params: OmieEnterpriseEnum) {
    this._omieGateway.setSecrets(params);
  }

  async findAll(idPedido: string) {
    const data = this._omieGateway.formatBody("ListarAnexo", {
      nId: idPedido,
      cTabela: "pedido-venda",
    });

    const response = await this._omieGateway._httpProvider.post<any>(
      "/geral/anexo/",
      data
    );

    return response.data;
  }
}

export default new AttachmentsOmieService();
