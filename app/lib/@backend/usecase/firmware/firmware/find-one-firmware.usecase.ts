import { singleton } from "@/app/lib/util/singleton"
import { IFirmware, IFirmwareRepository } from "@/app/lib/@backend/domain"
import { firmwareRepository } from "@/app/lib/@backend/repository/mongodb"

class FindOneFirmwareUsecase {
  repository: IFirmwareRepository

  constructor() {
    this.repository = firmwareRepository
  }

  async execute(args: Partial<IFirmware>) {
    return await this.repository.findOne(args)
  }
}

export const findOneFirmwareUsecase = singleton(FindOneFirmwareUsecase)
