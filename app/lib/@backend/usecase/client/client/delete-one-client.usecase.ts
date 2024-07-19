import { singleton } from "@/app/lib/util/singleton"
import { IClient, IClientRepository } from "@/app/lib/@backend/domain"
import { clientRepository } from "@/app/lib/@backend/repository/mongodb"

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
