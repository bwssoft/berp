import { singleton } from "@/app/lib/util/singleton";
import {
  IConfigurationLog,
  IConfigurationLogRepository,
} from "@/app/lib/@backend/domain";
import { configurationLogRepository } from "@/app/lib/@backend/infra";
import { RemoveFields } from "../../../decorators";

class CreateManyConfigurationLogUsecase {
  repository: IConfigurationLogRepository;

  constructor() {
    this.repository = configurationLogRepository;
  }

  @RemoveFields("_id")
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

    await this.repository.createMany(_input);

    return _input;
  }
}

export const createManyConfigurationLogUsecase = singleton(
  CreateManyConfigurationLogUsecase
);
