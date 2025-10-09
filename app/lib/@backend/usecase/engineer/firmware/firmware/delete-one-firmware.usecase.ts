import { singleton } from "@/app/lib/util/singleton"
import { IFirmware } from "@/app/lib/@backend/domain/engineer/entity/firmware.definition";
import { IFirmwareRepository } from "@/app/lib/@backend/domain/engineer/repository/firmware.repository.interface";
import { firmwareRepository } from "@/app/lib/@backend/infra"
import { firebaseGateway } from "@/app/lib/@backend/infra"
import { IFirebaseGateway } from "@/app/lib/@backend/domain/@shared/gateway/firebase.gateway.interface"

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
