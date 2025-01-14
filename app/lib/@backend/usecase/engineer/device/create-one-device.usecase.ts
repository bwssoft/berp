import { singleton } from "@/app/lib/util/singleton"
import { IDevice, IDeviceRepository } from "@/app/lib/@backend/domain"
import { deviceRepository } from "@/app/lib/@backend/infra"

class CreateOneDeviceUsecase {
  repository: IDeviceRepository

  constructor() {
    this.repository = deviceRepository
  }

  async execute(input: Omit<IDevice, "id" | "created_at">) {
    const client = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID()
    })
    return await this.repository.create(client)
  }
}

export const createOneDeviceUsecase = singleton(CreateOneDeviceUsecase)
