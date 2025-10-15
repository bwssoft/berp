import { singleton } from "@/app/lib/util/singleton";
import type { IFirmwareUpdateLog } from "@/backend/domain/production/entity/firmware-update-log.definition";
import type { IFirmwareUpdateLogRepository } from "@/backend/domain/production/repository/firmware-update-log.repository";
import { firmwareUpdateLogRepository } from "@/backend/infra";
import { randomUUID } from "crypto";

class CreateOneFirmwareUpdateLogUsecase {
  repository: IFirmwareUpdateLogRepository;

  constructor() {
    this.repository = firmwareUpdateLogRepository;
  }

  async execute(input: Omit<IFirmwareUpdateLog, "id" | "created_at">) {
    const payload: IFirmwareUpdateLog = {
      ...input,
      id: randomUUID(),
      created_at: new Date(),
    };

    await this.repository.create(payload);

    return payload;
  }
}

export const createOneFirmwareUpdateLogUsecase = singleton(
  CreateOneFirmwareUpdateLogUsecase
);
