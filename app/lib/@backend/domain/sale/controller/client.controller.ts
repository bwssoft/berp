import { BaseOmieEntity } from "../../../infra/api/controller/sale/client/client.dto";
import { ClientOmieEntity } from "../../../infra/api/controller/sale/client/client.validator";

export interface IClientController {
  execute: (data: BaseOmieEntity<ClientOmieEntity>) => Promise<void>;
}
