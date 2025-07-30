import { IDevice, IDeviceRepository } from "@/app/lib/@backend/domain";
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
