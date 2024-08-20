import { BaseOmieEntity } from "../entities/base.omie.entity"
import { ClientOmieEntity } from "../entities/client.omie.entity"

export enum EventsTopics {
  Include = "ClienteFornecedor.Incluido",
  Update = "ClienteFornecedor.Alterado",
}

export type EventObjectInterfaces = {
  [EventsTopics.Include]: BaseOmieEntity<ClientOmieEntity, EventsTopics.Include>
  [EventsTopics.Update]: BaseOmieEntity<ClientOmieEntity, EventsTopics.Update>
}