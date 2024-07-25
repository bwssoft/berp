import { singleton } from "@/app/lib/util/singleton"
import { IDevice, IDeviceRepository } from "@/app/lib/@backend/domain"
import { deviceRepository } from "@/app/lib/@backend/repository/mongodb"

class DeleteOneDeviceUsecase {
  repository: IDeviceRepository

  constructor() {
    this.repository = deviceRepository
  }

  async execute(input: Partial<IDevice>) {
    return await this.repository.deleteOne(input)
  }
}

export const deleteOneDeviceUsecase = singleton(DeleteOneDeviceUsecase)
