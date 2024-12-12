import { BaseOmieEntity } from "./client.dto"
import { ClientOmieEntity } from "./client.validator"

export enum EventsTopics {
  Include = "ClienteFornecedor.Incluido",
  Update = "ClienteFornecedor.Alterado",
  Delete = "ClienteFornecedor.Excluido"
}

export type EventObjectInterfaces = {
  [EventsTopics.Include]: BaseOmieEntity<ClientOmieEntity, EventsTopics.Include>
  [EventsTopics.Update]: BaseOmieEntity<ClientOmieEntity, EventsTopics.Update>
  [EventsTopics.Delete]: BaseOmieEntity<ClientOmieEntity, EventsTopics.Delete>
}