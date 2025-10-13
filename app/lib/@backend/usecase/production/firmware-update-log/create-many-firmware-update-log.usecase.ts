import { singleton } from "@/app/lib/util/singleton";
import { RemoveFields } from "@/backend/decorators";
import type { IFirmwareUpdateLog } from "@/backend/domain/production/entity/firmware-update-log.definition";
import type { IFirmwareUpdateLogRepository } from "@/backend/domain/production/repository/firmware-update-log.repository";
import { firmwareUpdateLogRepository } from "@/backend/infra";
import { randomUUID } from "crypto";

class CreateManyFirmwareUpdateLogUsecase {
  repository: IFirmwareUpdateLogRepository;

  constructor() {
    this.repository = firmwareUpdateLogRepository;
  }

  @RemoveFields("_id")
  async execute(input: Omit<IFirmwareUpdateLog, "id" | "created_at">[]) {
    const payload = input.map((log) =>
      Object.assign(log, {
        id: randomUUID(),
        created_at: new Date(),
      })
    );

    await this.repository.createMany(payload);

    return payload;
  }
}

export const createManyFirmwareUpdateLogUsecase = singleton(
  CreateManyFirmwareUpdateLogUsecase
);
