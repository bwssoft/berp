import { singleton } from "@/app/lib/util/singleton";
import {
  IFirmwareUpdateLog,
  IFirmwareUpdateLogRepository,
} from "@/app/lib/@backend/domain";
import { firmwareUpdateLogRepository } from "@/app/lib/@backend/infra";

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
