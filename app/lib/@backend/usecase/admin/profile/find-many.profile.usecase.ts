import { IProfile, IProfileRepository } from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { profileRepository } from "@/app/lib/@backend/infra";
import { Filter } from "mongodb";

namespace Dto {
  export interface Input extends Filter<IProfile> {}
  export type Output = IProfile[];
}

class FindManyProfileUsecase {
  repository: IProfileRepository;

  constructor() {
    this.repository = profileRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    return await this.repository.findMany(arg.filter, undefined, arg.sort ?? { name: -1 });
  }
}

export const findManyProfileUsecase = singleton(FindManyProfileUsecase);
