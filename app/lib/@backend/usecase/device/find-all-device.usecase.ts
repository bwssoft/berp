import { singleton } from "@/app/lib/util/singleton"
import { IDeviceRepository } from "@/app/lib/@backend/domain"
import { deviceRepository } from "@/app/lib/@backend/repository/mongodb"

class FindAllDeviceUsecase {
  repository: IDeviceRepository

  constructor() {
    this.repository = deviceRepository
  }

  async execute() {
    return await this.repository.findAll()
  }
}

export const findAllDeviceUsecase = singleton(FindAllDeviceUsecase)
