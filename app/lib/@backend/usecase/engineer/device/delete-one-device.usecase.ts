import { singleton } from "@/app/lib/util/singleton"
import { IDevice } from "@/app/lib/@backend/domain/engineer/entity/device.definition";
import { IDeviceRepository } from "@/app/lib/@backend/domain/engineer/repository/device.repository.interface";
import { deviceRepository } from "@/app/lib/@backend/infra"

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
