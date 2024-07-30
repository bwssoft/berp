import { singleton } from "@/app/lib/util/singleton"
import { IFirmwareRepository } from "@/app/lib/@backend/domain"
import { firmwareRepository } from "@/app/lib/@backend/repository/mongodb"

class FindAllFirmwareUsecase {
  repository: IFirmwareRepository

  constructor() {
    this.repository = firmwareRepository
  }

  async execute() {
    return await this.repository.findAll()
  }
}

export const findAllFirmwareUsecase = singleton(FindAllFirmwareUsecase)
