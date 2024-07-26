import { singleton } from "@/app/lib/util/singleton"
import { IDevice, IDeviceRepository } from "@/app/lib/@backend/domain"
import { deviceRepository } from "@/app/lib/@backend/repository/mongodb"

class FindManyDeviceBySerialUsecase {
  repository: IDeviceRepository

  constructor() {
    this.repository = deviceRepository
  }

  async execute(serial: string[]) {
    const pipeline = this.pipeline(serial)
    const aggregate = await this.repository.aggregate(pipeline)
    return await aggregate.toArray() as IDevice[]
  }

  pipeline(serial: string[]) {
    const pipeline = [
      { $match: { serial: { $in: serial } } }
    ]
    return pipeline
  }
}

export const findManyDeviceBySerialUsecase = singleton(FindManyDeviceBySerialUsecase)
