import { singleton } from "@/app/lib/util/singleton";
import type { IAutoTestLog } from "@/backend/domain/production/entity/auto-test-log.definition";
import type { IAutoTestLogRepository } from "@/backend/domain/production/repository/auto-test-log.repository";
import { autoTestLogRepository } from "@/backend/infra";
import { randomUUID } from "crypto";

class CreateManyAutoTestLogUsecase {
  repository: IAutoTestLogRepository;

  constructor() {
    this.repository = autoTestLogRepository;
  }

  async execute(input: Omit<IAutoTestLog, "id" | "created_at">[]) {
    const payload = input.map((entry) =>
      Object.assign(entry, {
        id: randomUUID(),
        created_at: new Date(),
      })
    );

    if (payload.length === 0) {
      return [];
    }

    await this.repository.createMany(payload);

    return payload;
  }
}

export const createManyAutoTestLogUsecase = singleton(
  CreateManyAutoTestLogUsecase
);
