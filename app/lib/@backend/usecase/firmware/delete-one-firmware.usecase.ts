import { singleton } from "@/app/lib/util/singleton"
import { IFirmware, IFirmwareRepository } from "@/app/lib/@backend/domain"
import { firmwareRepository } from "@/app/lib/@backend/repository/mongodb"

class DeleteOneFirmwareUsecase {
  repository: IFirmwareRepository

  constructor() {
    this.repository = firmwareRepository
  }

  async execute(input: Partial<IFirmware>) {
    return await this.repository.deleteOne(input)
  }
}

export const deleteOneFirmwareUsecase = singleton(DeleteOneFirmwareUsecase)
