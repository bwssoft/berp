import { IDevice } from "@/app/lib/@backend/domain/engineer/entity/device.definition";
import { IDeviceRepository } from "@/app/lib/@backend/domain/engineer/repository/device.repository.interface";
import { deviceRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import type { Filter } from "mongodb";
import { RemoveFields } from "../../../decorators";

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
