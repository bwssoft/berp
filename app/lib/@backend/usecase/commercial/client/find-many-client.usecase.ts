import { IClient, IClientRepository } from "@/app/lib/@backend/domain";
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
    return await this.repository.findMany(input);
  }
}

export const findManyClientUsecase = singleton(FinaManyClientUsecase);
