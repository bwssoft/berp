import { IClient } from "@/app/@lib/backend/domain";
import { BaseRepository } from "../@base/base";

class ClientRepository extends BaseRepository<IClient> {
  private static instance: ClientRepository;

  private constructor() {
    super({
      collection: "client",
      db: "bstock"
    });
  }

  public static getInstance(): ClientRepository {
    if (!ClientRepository.instance) {
      ClientRepository.instance = new ClientRepository();
    }
    return ClientRepository.instance;
  }
}

export const clientRepository = ClientRepository.getInstance();
