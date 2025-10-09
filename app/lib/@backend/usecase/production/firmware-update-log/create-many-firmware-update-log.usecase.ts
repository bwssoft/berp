import { singleton } from "@/app/lib/util/singleton";
import IFirmwareUpdateLog from "@/app/lib/@backend/domain/production/entity/firmware-update-log.definition";
import { firmwareUpdateLogRepository } from "@/app/lib/@backend/infra";
import { RemoveFields } from "../../../decorators";

class CreateManyFirmwareUpdateLogUsecase {
  repository: IFirmwareUpdateLogRepository;

  constructor() {
    this.repository = firmwareUpdateLogRepository;
  }

  @RemoveFields("_id")
  async execute(input: Omit<IFirmwareUpdateLog, "id" | "created_at">[]) {
    const _input: IFirmwareUpdateLog[] = [];
    for (const p in input) {
      const configuration_log = input[p];
      _input.push(
        Object.assign(configuration_log, {
          created_at: new Date(),
          id: crypto.randomUUID(),
        })
      );
    }

    await this.repository.createMany(_input);

    return _input;
  }
}

export const createManyFirmwareUpdateLogUsecase = singleton(
  CreateManyFirmwareUpdateLogUsecase
);
