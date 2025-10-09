import { singleton } from "@/app/lib/util/singleton";
import IFirmwareUpdateLog from "@/backend/domain/production/entity/firmware-update-log.definition";
import { firmwareUpdateLogRepository } from "@/backend/infra";

class UpdateBulkFirmwareUpdateLogUsecase {
  repository: IFirmwareUpdateLogRepository;

  constructor() {
    this.repository = firmwareUpdateLogRepository;
  }

  async execute(
    operations: {
      query: { id: string };
      value: Partial<IFirmwareUpdateLog>;
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

export const updateBulkFirmwareUpdateLogUsecase = singleton(
  UpdateBulkFirmwareUpdateLogUsecase
);

