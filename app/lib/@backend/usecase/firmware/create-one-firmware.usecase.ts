import { singleton } from "@/app/lib/util/singleton"
import { IFirmware, IFirmwareRepository } from "@/app/lib/@backend/domain"
import { firmwareRepository } from "@/app/lib/@backend/repository/mongodb"

class CreateOneFirmwareUsecase {
  repository: IFirmwareRepository

  constructor() {
    this.repository = firmwareRepository
  }

  async execute(args: Omit<IFirmware, "id" | "created_at">) {
    const firmware = Object.assign(
      args,
      {
        created_at: new Date(),
        id: crypto.randomUUID()
      }
    )
    await this.repository.create(firmware)

    return firmware
  }
}

export const createOneFirmwareUsecase = singleton(CreateOneFirmwareUsecase)
