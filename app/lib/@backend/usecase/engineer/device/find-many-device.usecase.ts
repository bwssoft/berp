
import { singleton } from "@/app/lib/util/singleton";
import { RemoveFields } from "@/backend/decorators";
import type { IDevice } from "@/backend/domain/engineer/entity/device.definition";
import type { IDeviceRepository } from "@/backend/domain/engineer/repository/device.repository.interface";
import { deviceRepository } from "@/backend/infra";
import type { Filter } from "mongodb";

class FindManyDeviceUsecase {
  repository: IDeviceRepository;

  constructor() {
    this.repository = deviceRepository;
  }

  @RemoveFields("_id")
  async execute(input: Filter<IDevice>) {
    const { docs } = await this.repository.findMany(input);
    return docs;
  }
}

export const findManyDeviceUsecase = singleton(FindManyDeviceUsecase);
