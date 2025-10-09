import { IConfigurationProfileRepository } from "@/backend/domain/engineer/repository/configuration-profile.repository";
import { configurationProfileRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";

namespace Dto {
  export type Input = {};
  export type Output = {
    total: number;
    validate_by_human: number;
    validate_by_system: number;
    validate_pending: number;
  };
}

class StatsConfigurationProfileUsecase {
  repository: IConfigurationProfileRepository;

  constructor() {
    this.repository = configurationProfileRepository;
  }

  @RemoveMongoId()
  async execute() {
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
          validate_by_human: {
            $sum: {
              $cond: [
                {
                  $eq: ["$validation.by_human", true],
                },
                1,
                0,
              ],
            },
          },
          validate_by_system: {
            $sum: {
              $cond: [
                {
                  $eq: ["$validation.by_system", true],
                },
                1,
                0,
              ],
            },
          },
          validate_pending: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$validation", null] },
                    {
                      $and: [
                        {
                          $ne: ["$validation.by_human", true],
                        },
                        {
                          $ne: ["$validation.by_system", true],
                        },
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          validate_by_human: 1,
          validate_by_system: 1,
          validate_pending: 1,
        },
      },
    ];
  }
}

export const statsConfigurationProfileUsecase = singleton(
  StatsConfigurationProfileUsecase
);

