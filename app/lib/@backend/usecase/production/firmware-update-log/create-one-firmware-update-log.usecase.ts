import { singleton } from "@/app/lib/util/singleton";
import {
  IFirmwareUpdateLog,
  IFirmwareUpdateLogRepository,
} from "@/app/lib/@backend/domain";
import { firmwareUpdateLogRepository } from "@/app/lib/@backend/infra";

class CreateOneFirmwareUpdateLogUsecase {
  repository: IFirmwareUpdateLogRepository;

  constructor() {
    this.repository = firmwareUpdateLogRepository;
  }

  async execute(input: Omit<IFirmwareUpdateLog, "id" | "created_at">) {
    const _input = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID(),
    });

    await this.repository.create(_input);

    return _input;
  }
}

export const createOneFirmwareUpdateLogUsecase = singleton(
  CreateOneFirmwareUpdateLogUsecase
);
