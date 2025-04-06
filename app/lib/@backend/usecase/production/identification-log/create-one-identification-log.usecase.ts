import { singleton } from "@/app/lib/util/singleton";
import {
  IIdentificationLog,
  IIdentificationLogRepository,
} from "@/app/lib/@backend/domain";
import { identificationLogRepository } from "@/app/lib/@backend/infra";

class CreateOneIdentificationLogUsecase {
  repository: IIdentificationLogRepository;

  constructor() {
    this.repository = identificationLogRepository;
  }

  async execute(input: Omit<IIdentificationLog, "id" | "created_at">) {
    const _input = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID(),
    });

    await this.repository.create(_input);

    return _input;
  }
}

export const createOneIdentificationLogUsecase = singleton(
  CreateOneIdentificationLogUsecase
);
