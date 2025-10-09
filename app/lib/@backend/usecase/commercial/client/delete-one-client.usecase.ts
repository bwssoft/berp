import { singleton } from "@/app/lib/util/singleton"
import { IClient } from "@/app/lib/@backend/domain/commercial/entity/client.definition";
import { IClientRepository } from "@/app/lib/@backend/domain/commercial/repository/client.repository";
import { clientRepository } from "@/app/lib/@backend/infra"

class DeleteOneClientUsecase {
  repository: IClientRepository

  constructor() {
    this.repository = clientRepository
  }

  async execute(input: Partial<IClient>) {
    return await this.repository.deleteOne(input)
  }
}

export const deleteOneClientUsecase = singleton(DeleteOneClientUsecase)
