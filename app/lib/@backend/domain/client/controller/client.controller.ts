import { BaseOmieEntity } from "../../../controller/client/client.dto";
import { ClientOmieEntity } from "../../../controller/client/client.validator";

export interface IClientController {
  execute: (data: BaseOmieEntity<ClientOmieEntity>) => Promise<void>
}