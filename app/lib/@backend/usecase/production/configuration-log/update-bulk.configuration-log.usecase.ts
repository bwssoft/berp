import { singleton } from "@/app/lib/util/singleton";
import type { IConfigurationLog } from "@/backend/domain/production/entity/configuration-log.definition";
import type { IConfigurationLogRepository } from "@/backend/domain/production/repository/configuration-log.repository";
import { configurationLogRepository } from "@/backend/infra";

class UpdateBulkConfigurationLogUsecase {
  repository: IConfigurationLogRepository;

  constructor() {
    this.repository = configurationLogRepository;
  }

  async execute(
    operations: {
      query: { id: string };
      value: Partial<IConfigurationLog>;
    }[]
  ) {
    return await this.repository.updateBulk(
      operations.map(({ query, value }) => ({
        filter: query,
        update: { $set: value },
        upsert: false,
      }))
    );
  }
}

export const updateBulkConfigurationLogUsecase = singleton(
  UpdateBulkConfigurationLogUsecase
);
