import { singleton } from "@/app/lib/util/singleton";
import {
  IConfigurationLog,
  IConfigurationLogRepository,
} from "@/app/lib/@backend/domain";
import { configurationLogRepository } from "@/app/lib/@backend/infra";

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
      operations.map(({ query, value }) => ({ query, value: { $set: value } }))
    );
  }
}

export const updateBulkConfigurationLogUsecase = singleton(
  UpdateBulkConfigurationLogUsecase
);
