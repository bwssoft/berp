import { singleton } from "@/app/lib/util/singleton"
import { IRequestToUpdate, IRequestToUpdateRepository } from "@/app/lib/@backend/domain"
import { requestToUpdateRepository } from "@/app/lib/@backend/repository/mongodb"

class FindOneRequestToUpdateUsecase {
  repository: IRequestToUpdateRepository

  constructor() {
    this.repository = requestToUpdateRepository
  }

  async execute(args: Partial<IRequestToUpdate>) {
    return await this.repository.findOne(args)
  }
}

export const findOneRequestToUpdateUsecase = singleton(FindOneRequestToUpdateUsecase)
