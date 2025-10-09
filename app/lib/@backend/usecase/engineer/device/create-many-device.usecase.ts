import { singleton } from "@/app/lib/util/singleton"
import { IDevice } from "@/app/lib/@backend/domain/engineer/entity/device.definition";
import { IDeviceRepository } from "@/app/lib/@backend/domain/engineer/repository/device.repository.interface";
import { deviceRepository } from "@/app/lib/@backend/infra"

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
