import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { IConfigurationProfile } from "@/backend/domain/engineer/entity/configuration-profile.definition";
import type { IConfigurationProfileRepository } from "@/backend/domain/engineer/repository/configuration-profile.repository.interface";
import { configurationProfileRepository } from "@/backend/infra";

class FindOneConfigurationProfileUsecase {
  repository: IConfigurationProfileRepository;

  constructor() {
    this.repository = configurationProfileRepository;
  }

  @RemoveMongoId()
  async execute(input: Partial<IConfigurationProfile>) {
    return await this.repository.findOne(input);
  }
}

export const findOneConfigurationProfileUsecase = singleton(
  FindOneConfigurationProfileUsecase
);

