import IConfigurationProfile from "@/app/lib/@backend/domain/engineer/entity/configuration-profile.definition";
import { clientRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { Filter } from "mongodb";

namespace Dto {
  export interface Input extends Filter<IClient> {}
  export type Document = IClient & {
    configuration_profile: IConfigurationProfile[];
  };
  export type Output = IClient & {
    configuration_profile: IConfigurationProfile[];
  };
}

class FindOneClientWithConfigurationProfileUsecase {
  repository: IClientRepository;

  constructor() {
    this.repository = clientRepository;
  }

  @RemoveMongoId()
  async execute(input: Dto.Input): Promise<Dto.Output> {
    const aggragate = await this.repository.aggregate<Dto.Document>(
      this.pipeline(input)
    );
    const [result] = await aggragate.toArray();
    return result;
  }

  pipeline(input: Dto.Input) {
    return [
      { $match: input },
      {
        $lookup: {
          from: "engineer-configuration-profile",
          as: "configuration_profile",
          localField: "id",
          foreignField: "client_id",
        },
      },
      { $limit: 20 },
      {
        $project: {
          id: 1,
          company_name: 1,
          trade_name: 1,
          document: 1,
          configuration_profile: 1,
        },
      },
    ];
  }
}

export const findOneClientWithConfigurationProfileUsecase = singleton(
  FindOneClientWithConfigurationProfileUsecase
);
