import { singleton } from "@/app/lib/util/singleton";
import { IDevice, IDeviceRepository } from "@/app/lib/@backend/domain";
import { deviceRepository } from "@/app/lib/@backend/infra";

class UpsertOneDeviceUsecase {
  repository: IDeviceRepository;

  constructor() {
    this.repository = deviceRepository;
  }

  async execute(
    query: { id?: string; "equipment.serial"?: string },
    value: Omit<IDevice, "id" | "created_at">
  ) {
    return await this.repository.upsertOne(query, {
      $set: value,
      $setOnInsert: {
        id: crypto.randomUUID(),
        created_at: new Date(),
      },
    });
  }
}

export const upsertOneDeviceUsecase = singleton(UpsertOneDeviceUsecase);
