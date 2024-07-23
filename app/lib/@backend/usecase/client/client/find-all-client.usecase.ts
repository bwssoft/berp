import { singleton } from "@/app/lib/util/singleton"
import { IClientRepository } from "@/app/lib/@backend/domain"
import { clientRepository } from "@/app/lib/@backend/repository/mongodb"

class FindAllClientUsecase {
  repository: IClientRepository

  constructor() {
    this.repository = clientRepository
  }

  async execute() {
    return await this.repository.findAll()
  }
}

export const findAllClientUsecase = singleton(FindAllClientUsecase)
