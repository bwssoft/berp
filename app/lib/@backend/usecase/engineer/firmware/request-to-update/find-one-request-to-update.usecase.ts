import { singleton } from "@/app/lib/util/singleton"
import { IRequestToUpdate } from "@/app/lib/@backend/domain/engineer/entity/request-to-update-firmware.definition";
import { IRequestToUpdateRepository } from "@/app/lib/@backend/domain/engineer/repository/request-to-update-firmware.repository.interface";
import { requestToUpdateRepository } from "@/app/lib/@backend/infra"

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
