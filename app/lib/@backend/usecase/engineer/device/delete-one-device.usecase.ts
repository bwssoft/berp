
import { singleton } from "@/app/lib/util/singleton";
import type { IDevice } from "@/backend/domain/engineer/entity/device.definition";
import type { IDeviceRepository } from "@/backend/domain/engineer/repository/device.repository.interface";
import { deviceRepository } from "@/backend/infra";

class DeleteOneDeviceUsecase {
  repository: IDeviceRepository;

  constructor() {
    this.repository = deviceRepository;
  }

  async execute(input: Partial<IDevice>) {
    return await this.repository.deleteOne(input);
  }
}

export const deleteOneDeviceUsecase = singleton(DeleteOneDeviceUsecase);
