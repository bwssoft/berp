import { singleton } from "@/app/lib/util/singleton"
import { IDevice, IDeviceRepository } from "@/app/lib/@backend/domain"
import { deviceRepository } from "@/app/lib/@backend/repository/mongodb"

class FindOneDeviceUsecase {
  repository: IDeviceRepository

  constructor() {
    this.repository = deviceRepository
  }

  async execute(input: Partial<IDevice>) {
    return await this.repository.findOne(input)
  }
}

export const findOneDeviceUsecase = singleton(FindOneDeviceUsecase)
