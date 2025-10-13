import { singleton } from "@/app/lib/util/singleton";
import { RemoveFields } from "@/backend/decorators";
import type { IConfigurationLog } from "@/backend/domain/production/entity/configuration-log.definition";
import type { IConfigurationLogRepository } from "@/backend/domain/production/repository/configuration-log.repository";
import { configurationLogRepository } from "@/backend/infra";
import { randomUUID } from "crypto";

class CreateManyConfigurationLogUsecase {
  repository: IConfigurationLogRepository;

  constructor() {
    this.repository = configurationLogRepository;
  }

  @RemoveFields("_id")
  async execute(input: Omit<IConfigurationLog, "id" | "created_at">[]) {
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

export const createManyConfigurationLogUsecase = singleton(
  CreateManyConfigurationLogUsecase
);
