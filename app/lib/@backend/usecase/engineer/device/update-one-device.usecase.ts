import { singleton } from "@/app/lib/util/singleton"
import { IDevice } from "@/backend/domain/engineer/entity/device.definition";
import { IDeviceRepository } from "@/backend/domain/engineer/repository/device.repository";
import { deviceRepository } from "@/backend/infra"

class UpdateOneDeviceUsecase {
  repository: IDeviceRepository

  constructor() {
    this.repository = deviceRepository
  }

  async execute(query: { id: string }, value: Omit<IDevice, "id" | "created_at">) {
    return await this.repository.updateOne(query, { $set: value })
  }
}

export const updateOneDeviceUsecase = singleton(UpdateOneDeviceUsecase)

