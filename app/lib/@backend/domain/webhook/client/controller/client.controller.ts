import { BaseOmieEntity } from "../entities/base.omie.entity";
import { ClientOmieEntity } from "../entities/client.omie.entity";

export interface IClientController {
  execute: (data: BaseOmieEntity<ClientOmieEntity>) => Promise<void>
}