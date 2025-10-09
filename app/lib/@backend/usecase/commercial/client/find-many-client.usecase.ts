import { IClient } from "@/app/lib/@backend/domain/commercial/entity/client.definition";
import { IClientRepository } from "@/app/lib/@backend/domain/commercial/repository/client.repository";
import { clientRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import type { Filter } from "mongodb";

class FinaManyClientUsecase {
  repository: IClientRepository;

  constructor() {
    this.repository = clientRepository;
  }

  @RemoveMongoId()
  async execute(input: Filter<IClient>) {
    const { docs } = await this.repository.findMany(input);
    return docs
  }
}

export const findManyClientUsecase = singleton(FinaManyClientUsecase);
