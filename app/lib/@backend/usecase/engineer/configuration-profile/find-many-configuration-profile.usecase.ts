import {
  IConfigurationProfile,
  IConfigurationProfileRepository,
} from "@/app/lib/@backend/domain";
import { configurationProfileRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { Filter } from "mongodb";

namespace Dto {
  export interface Input extends Filter<IConfigurationProfile> {}
  export type Document = IConfigurationProfile & {
    technology: Technology;
    client: Client;
  };
  export type Output = (IConfigurationProfile & {
    technology: Technology;
    client: Client;
  })[];

  export interface Client {
    id: string;
    document: { value: string };
    company_name: string;
    trade_name: string;
  }
  export interface Technology {
    id: string;
    name: { brand: string };
  }
}

class FindManyConfigurationProfileUsecase {
  repository: IConfigurationProfileRepository;

  constructor() {
    this.repository = configurationProfileRepository;
  }

  @RemoveMongoId()
  async execute(input: Dto.Input) {
    const aggregate = await this.repository.aggregate<Dto.Document>(
      this.pipeline(input)
    );
    return await aggregate.toArray();
  }

  pipeline(input: Dto.Input) {
    return [
      { $match: { ...input } },
      {
        $lookup: {
          from: "commercial-client",
          as: "client",
          localField: "client_id",
          foreignField: "id",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                document: 1,
                corporate_name: 1,
                trade_name: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "engineer-technology",
          as: "technology",
          localField: "technology_id",
          foreignField: "id",
          pipeline: [{ $project: { _id: 0, id: 1, name: 1 } }],
        },
      },
      {
        $project: {
          id: 1,
          client_id: 1,
          use_case: 1,
          name: 1,
          type: 1,
          config: 1,
          optional_functions: 1,
          created_at: 1,
          user_id: 1,
          technology_id: 1,
          validation: 1,
          technology: { $first: "$technology" },
          client: { $first: "$client" },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 20 },
    ];
  }
}

export const findManyConfigurationProfileUsecase = singleton(
  FindManyConfigurationProfileUsecase
);
