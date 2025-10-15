import { IProfile } from "@/backend/domain/admin/entity/profile.definition";
import { IProfileRepository } from "@/backend/domain/admin/repository/profile.repository";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { profileRepository } from "@/backend/infra";
import { Filter } from "mongodb";

namespace Dto {
  export interface Input extends Filter<IProfile> {}
  export type Output = IProfile | null;
}

class FindOneProfileUsecase {
  repository: IProfileRepository;

  constructor() {
    this.repository = profileRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    return await this.repository.findOne(arg);
  }
}

export const findOneProfileUsecase = singleton(FindOneProfileUsecase);

