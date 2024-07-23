import { singleton } from "@/app/lib/util/singleton"
import { IClient, IClientRepository } from "@/app/lib/@backend/domain"
import { clientRepository } from "@/app/lib/@backend/repository/mongodb"

class FindOneClientUsecase {
  repository: IClientRepository

  constructor() {
    this.repository = clientRepository
  }

  async execute(input: Partial<IClient>) {
    return await this.repository.findOne(input)
  }
}

export const findOneClientUsecase = singleton(FindOneClientUsecase)
