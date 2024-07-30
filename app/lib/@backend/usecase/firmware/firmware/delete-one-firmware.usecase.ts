import { singleton } from "@/app/lib/util/singleton"
import { IFirmware, IFirmwareRepository } from "@/app/lib/@backend/domain"
import { firmwareRepository } from "@/app/lib/@backend/repository/mongodb"
import { firebaseGateway } from "../../../gateway/firebase/firebase.gateway"
import { IFirebaseGateway } from "../../../domain/@shared/gateway/firebase.gateway.interface"

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
