import { singleton } from "@/app/lib/util/singleton"
import { IDevice, IDeviceRepository } from "@/app/lib/@backend/domain"
import { deviceRepository } from "@/app/lib/@backend/repository/mongodb"

class CreateManyDeviceUsecase {
  repository: IDeviceRepository

  constructor() {
    this.repository = deviceRepository
  }

  async execute(inputs: Omit<IDevice, "id" | "created_at">[]) {
    const _inputs = inputs.map(i => Object.assign(i, {
      created_at: new Date(),
      id: crypto.randomUUID()
    }))
    return await this.repository.createMany(_inputs)
  }
}

export const createManyDeviceUsecase = singleton(CreateManyDeviceUsecase)
