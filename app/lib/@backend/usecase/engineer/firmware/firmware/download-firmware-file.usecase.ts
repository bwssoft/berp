import { IFirmwareRepository } from "@/backend/domain/engineer/repository/firmware.repository";
import { IFirebaseGateway } from '@/backend/domain/@shared/gateway/firebase.gateway.interface'
import { firmwareRepository, firebaseGateway } from '@/backend/infra'
import { singleton } from '@/app/lib/util'

class DownloadFirmwareFile {
  repository: IFirmwareRepository
  gateway: IFirebaseGateway

  constructor() {
    this.repository = firmwareRepository
    this.gateway = firebaseGateway
  }

  async execute(name: string) {
    const firmware = await this.repository.findOneByName(name)
    if (!firmware) return

    const arrayBuffer = await this.gateway.downloadFile({
      bucket: firmware.file.bucket,
      name: firmware.file.name,
    })

    const buffer = Buffer.from(arrayBuffer)

    const stream = new ReadableStream({
      pull(controller) {
        controller.enqueue(buffer)
        controller.close()
      }
    })

    return { stream, firmware }
  }
}

export const downloadFirmwareFile = singleton(DownloadFirmwareFile)
