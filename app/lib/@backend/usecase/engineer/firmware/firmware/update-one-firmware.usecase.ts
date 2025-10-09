import { singleton } from "@/app/lib/util/singleton"
import { IFirmware } from "@/backend/domain/engineer/entity/firmware.definition";
import { IFirmwareRepository } from "@/backend/domain/engineer/repository/firmware.repository";
import { firmwareRepository, firebaseGateway } from "@/backend/infra"
import { IFirebaseGateway } from "@/backend/domain/@shared/gateway/firebase.gateway.interface"

class UpdateOneFirmwareUsecase {
  repository: IFirmwareRepository
  gateway: IFirebaseGateway

  constructor() {
    this.repository = firmwareRepository
    this.gateway = firebaseGateway
  }

  async execute(
    query: { id: string },
    value: Omit<IFirmware, "id" | "created_at">,
    file?: File
  ) {
    if (file) {
      await this.gateway.deleteFile({ name: value.file.name, bucket: value.file.bucket })
      const _file = await this.gateway.uploadFile(file as File, "berp/firmware")
      Object.assign(
        value,
        {
          file: _file,
        }
      )
    }
    return await this.repository.updateOne(query, { $set: value })
  }
}

export const updateOneFirmwareUsecase = singleton(UpdateOneFirmwareUsecase)

