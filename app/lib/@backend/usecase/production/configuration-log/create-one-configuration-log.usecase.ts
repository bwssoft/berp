import { singleton } from "@/app/lib/util/singleton";
import type { IConfigurationLog } from "@/backend/domain/production/entity/configuration-log.definition";
import type { IConfigurationLogRepository } from "@/backend/domain/production/repository/configuration-log.repository";
import { configurationLogRepository } from "@/backend/infra";
import { randomUUID } from "crypto";

class CreateOneConfigurationLogUsecase {
  repository: IConfigurationLogRepository;

  constructor() {
    this.repository = configurationLogRepository;
  }

  async execute(input: Omit<IConfigurationLog, "id" | "created_at">) {
    const payload: IConfigurationLog = {
      ...input,
      id: randomUUID(),
      created_at: new Date(),
    };

    await this.repository.create(payload);

    return payload;
  }
}

export const createOneConfigurationLogUsecase = singleton(
  CreateOneConfigurationLogUsecase
);
