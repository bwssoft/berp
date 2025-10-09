import IConfigurationProfile from "@/backend/domain/engineer/entity/configuration-profile.definition";
import { configurationProfileRepository, deviceRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";

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

export const findOneConfigurationProfileUsecase = singleton(FindOneConfigurationProfileUsecase);

