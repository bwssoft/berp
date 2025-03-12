import { singleton } from "@/app/lib/util/singleton";
import {
  IConfigurationLog,
  IConfigurationLogRepository,
} from "@/app/lib/@backend/domain";
import { configurationLogRepository } from "@/app/lib/@backend/infra";

class CreateManyConfigurationLogUsecase {
  repository: IConfigurationLogRepository;

  constructor() {
    this.repository = configurationLogRepository;
  }

  async execute(input: Omit<IConfigurationLog, "id" | "created_at">[]) {
    const _input: IConfigurationLog[] = [];
    for (const p in input) {
      const configuration_log = input[p];
      _input.push(
        Object.assign(configuration_log, {
          created_at: new Date(),
          id: crypto.randomUUID(),
        })
      );
    }

    return await this.repository.createMany(_input);
  }
}

export const createManyConfigurationLogUsecase = singleton(
  CreateManyConfigurationLogUsecase
);
