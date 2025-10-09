import { singleton } from "@/app/lib/util/singleton"
import { IRequestToUpdate } from "@/backend/domain/engineer/entity/request-to-update-firmware.definition";
import { IRequestToUpdateRepository } from "@/backend/domain/engineer/repository/request-to-update-firmware.repository";
import { requestToUpdateRepository } from "@/backend/infra"

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

