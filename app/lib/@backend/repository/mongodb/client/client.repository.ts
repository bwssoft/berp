import { IClient } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base/base";
import { singleton } from "@/app/lib/util/singleton";

class ClientRepository extends BaseRepository<IClient> {
  constructor() {
    super({
      collection: "client",
      db: "bstock"
    });
  }
}

export const clientRepository = singleton(ClientRepository)
