import { singleton } from "@/app/lib/util/singleton"
import { IFirmware } from "@/backend/domain/engineer/entity/firmware.definition";
import { IFirmwareRepository } from "@/backend/domain/engineer/repository/firmware.repository";
import { firmwareRepository } from "@/backend/infra"
import { firebaseGateway } from "@/backend/infra"
import { IFirebaseGateway } from "@/backend/domain/@shared/gateway/firebase.gateway.interface"

class DeleteOneFirmwareUsecase {
  repository: IFirmwareRepository
  gateway: IFirebaseGateway

  constructor() {
    this.repository = firmwareRepository
    this.gateway = firebaseGateway
  }

  async execute(input: Partial<IFirmware>) {
    const firmware = await this.repository.findOne(input)
    if (!firmware) return
    await this.gateway.deleteFile(firmware.file)
    return await this.repository.deleteOne(input)
  }
}

export const deleteOneFirmwareUsecase = singleton(DeleteOneFirmwareUsecase)

