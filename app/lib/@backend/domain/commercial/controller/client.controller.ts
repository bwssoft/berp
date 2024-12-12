import { BaseOmieEntity } from "../../../infra/api/controller/commercial/client/client.dto";
import { ClientOmieEntity } from "../../../infra/api/controller/commercial/client/client.validator";

export interface IClientController {
  execute: (data: BaseOmieEntity<ClientOmieEntity>) => Promise<void>;
}
