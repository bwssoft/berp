import { singleton } from "@/app/lib/util/singleton"
import { IDevice, IDeviceRepository } from "@/app/lib/@backend/domain"
import { deviceRepository } from "@/app/lib/@backend/infra"

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
