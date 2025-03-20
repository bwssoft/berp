import { singleton } from "@/app/lib/util/singleton";
import {
  IDeviceIdentificationLog,
  IDeviceIdentificationLogRepository,
} from "@/app/lib/@backend/domain";
import { deviceIdentificationLogRepository } from "@/app/lib/@backend/infra";

class CreateOneDeviceIdentificationLogUsecase {
  repository: IDeviceIdentificationLogRepository;

  constructor() {
    this.repository = deviceIdentificationLogRepository;
  }

  async execute(input: Omit<IDeviceIdentificationLog, "id" | "created_at">) {
    const _input = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID(),
    });

    await this.repository.create(_input);

    return _input;
  }
}

export const createOneDeviceIdentificationLogUsecase = singleton(
  CreateOneDeviceIdentificationLogUsecase
);
