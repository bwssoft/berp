
import { singleton } from "@/app/lib/util/singleton";
import type { IDevice } from "@/backend/domain/engineer/entity/device.definition";
import type { IDeviceRepository } from "@/backend/domain/engineer/repository/device.repository.interface";
import { deviceRepository } from "@/backend/infra";

class CreateOneDeviceUsecase {
  repository: IDeviceRepository;

  constructor() {
    this.repository = deviceRepository;
  }

  async execute(input: Omit<IDevice, "id" | "created_at">) {
    const device = Object.assign(input, {
      id: crypto.randomUUID(),
      created_at: new Date(),
    });
    return await this.repository.create(device);
  }
}

export const createOneDeviceUsecase = singleton(CreateOneDeviceUsecase);
