import { singleton } from "@/app/lib/util/singleton"
import { IDevice, IDeviceRepository } from "@/app/lib/@backend/domain"
import { deviceRepository } from "@/app/lib/@backend/repository/mongodb"

class UpdateOneDeviceUsecase {
  repository: IDeviceRepository

  constructor() {
    this.repository = deviceRepository
  }

  async execute(query: { id: string }, value: Omit<IDevice, "id" | "created_at">) {
    return await this.repository.updateOne(query, value)
  }
}

export const updateOneDeviceUsecase = singleton(UpdateOneDeviceUsecase)
