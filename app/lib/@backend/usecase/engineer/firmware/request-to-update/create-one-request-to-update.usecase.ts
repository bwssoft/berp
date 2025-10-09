import { singleton } from "@/app/lib/util/singleton"
import { IRequestToUpdate } from "@/app/lib/@backend/domain/engineer/entity/request-to-update-firmware.definition";
import { IRequestToUpdateRepository } from "@/app/lib/@backend/domain/engineer/repository/request-to-update-firmware.repository.interface";
import { requestToUpdateRepository } from "@/app/lib/@backend/infra"

class CreateOneRequestToUpdateUsecase {
  repository: IRequestToUpdateRepository

  constructor() {
    this.repository = requestToUpdateRepository
  }

  async execute(input: Omit<IRequestToUpdate, "id" | "created_at">) {
    const request_to_update = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID()
    })
    return await this.repository.create(request_to_update)
  }
}

export const createOneRequestToUpdateUsecase = singleton(CreateOneRequestToUpdateUsecase)
