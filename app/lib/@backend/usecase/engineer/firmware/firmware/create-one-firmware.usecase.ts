import { singleton } from "@/app/lib/util/singleton"
import { IFirmware } from "@/backend/domain/engineer/entity/firmware.definition";
import { IFirmwareRepository } from "@/backend/domain/engineer/repository/firmware.repository";
import { firmwareRepository, firebaseGateway } from "@/backend/infra"
import { IFirebaseGateway } from "@/backend/domain/@shared/gateway/firebase.gateway.interface"

class CreateOneFirmwareUsecase {
  repository: IFirmwareRepository
  gateway: IFirebaseGateway

  constructor() {
    this.repository = firmwareRepository
    this.gateway = firebaseGateway
  }

  async execute(firmware: Omit<IFirmware, "id" | "created_at" | "file">, file: File) {
    const _file = await this.gateway.uploadFile(file as File, "berp/firmware")
    const _firmware = Object.assign(
      firmware,
      {
        file: _file,
        id: crypto.randomUUID(),
        created_at: new Date()
      }
    )
    await this.repository.create(_firmware)

    return firmware
  }
}

export const createOneFirmwareUsecase = singleton(CreateOneFirmwareUsecase)

