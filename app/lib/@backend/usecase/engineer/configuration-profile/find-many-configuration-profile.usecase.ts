import {
  IConfigurationProfile,
  IConfigurationProfileRepository,
} from "@/app/lib/@backend/domain";
import { configurationProfileRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

class FindManyConfigurationProfileUsecase {
  repository: IConfigurationProfileRepository;

  constructor() {
    this.repository = configurationProfileRepository;
  }

  @RemoveMongoId()
  async execute(input: Partial<IConfigurationProfile>) {
    return await this.repository.findAll(input);
  }
}

export const findManyConfigurationProfileUsecase = singleton(
  FindManyConfigurationProfileUsecase
);
