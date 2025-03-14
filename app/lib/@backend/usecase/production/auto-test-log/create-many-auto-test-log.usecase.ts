import { singleton } from "@/app/lib/util/singleton";
import {
  IAutoTestLog,
  IAutoTestLogRepository,
} from "@/app/lib/@backend/domain";
import { autoTestLogRepository } from "@/app/lib/@backend/infra";

class CreateManyAutoTestLogUsecase {
  repository: IAutoTestLogRepository;

  constructor() {
    this.repository = autoTestLogRepository;
  }

  async execute(input: Omit<IAutoTestLog, "id" | "created_at">[]) {
    const _input: IAutoTestLog[] = [];
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

export const createManyAutoTestLogUsecase = singleton(
  CreateManyAutoTestLogUsecase
);
