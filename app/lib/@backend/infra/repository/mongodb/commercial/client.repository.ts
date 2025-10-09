import { IClient } from "@/app/lib/@backend/domain/commercial/entity/client.definition";
import { BaseRepository } from "../@base";
import { singleton } from "@/app/lib/util/singleton";

class ClientRepository extends BaseRepository<IClient> {
  constructor() {
    super({
      collection: "commercial-client",
      db: "berp"
    });
  }
}

export const clientRepository = singleton(ClientRepository)
