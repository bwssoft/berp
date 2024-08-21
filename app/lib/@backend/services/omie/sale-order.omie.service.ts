import { OmieEnterpriseEnum } from "../../domain/@shared/gateway/omie/omie.gateway.interface";
import { OmieGateway } from "../../gateway/omie/base.gateway";

class SaleOrderOmieService {
  private _omieGateway: OmieGateway;

  constructor() {
    this._omieGateway = new OmieGateway();
  }

  setSecrets(params: OmieEnterpriseEnum) {
    this._omieGateway.setSecrets(params);
  }

  async find(codigo_pedido: string) {
    const data = this._omieGateway.formatBody("ConsultarPedido", {
      codigo_pedido,
    });

    const response = await this._omieGateway._httpProvider.post<any>(
      "/produtos/pedido/",
      data
    );

    return response.data;
  }
}

export default new SaleOrderOmieService();
