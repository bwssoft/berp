import { IFirmwareUpdateLogRepository } from "@/app/lib/@backend/domain/production/repository/firmware-update-log.repository.interface";
import { firmwareUpdateLogRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

namespace Dto {
  export type Input = {};
  export type Output = {
    total: number;
    success: number;
    failed: number;
    pending: number;
  };
}

class StatsFirmwareUpdateLogUsecase {
  repository: IFirmwareUpdateLogRepository;

  constructor() {
    this.repository = firmwareUpdateLogRepository;
  }

  @RemoveMongoId()
  async execute(): Promise<Dto.Output> {
    const aggregate = await this.repository.aggregate<Dto.Output>(
      this.pipeline()
    );
    const [result] = await aggregate.toArray();
    return result;
  }

  pipeline() {
    return [
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          success: {
            $sum: {
              $cond: [{ $eq: ["$status", true] }, 1, 0],
            },
          },
          failed: {
            $sum: {
              $cond: [{ $eq: ["$status", false] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          success: 1,
          failed: 1,
        },
      },
    ];
  }
}

export const statsFirmwareUpdateLogUsecase = singleton(
  StatsFirmwareUpdateLogUsecase
);
