import { singleton } from "@/app/lib/util/singleton"
import { IFirmware, IFirmwareRepository } from "@/app/lib/@backend/domain"
import { firmwareRepository } from "@/app/lib/@backend/repository/mongodb"

class UpdateOneFirmwareUsecase {
  repository: IFirmwareRepository

  constructor() {
    this.repository = firmwareRepository
  }

  async execute(query: { id: string }, value: Omit<IFirmware, "id" | "created_at">) {
    return await this.repository.updateOne(query, value)
  }
}

export const updateOneFirmwareUsecase = singleton(UpdateOneFirmwareUsecase)
