
import { singleton } from "@/app/lib/util/singleton";
import type { IDevice } from "@/backend/domain/engineer/entity/device.definition";
import type { IDeviceRepository } from "@/backend/domain/engineer/repository/device.repository.interface";
import { deviceRepository } from "@/backend/infra";

class CreateManyDeviceUsecase {
  repository: IDeviceRepository;

  constructor() {
    this.repository = deviceRepository;
  }

  async execute(inputs: Omit<IDevice, "id" | "created_at">[]) {
    const payload = inputs.map((device) =>
      Object.assign(device, {
        id: crypto.randomUUID(),
        created_at: new Date(),
      })
    );

    return await this.repository.createMany(payload);
  }
}

export const createManyDeviceUsecase = singleton(CreateManyDeviceUsecase);
