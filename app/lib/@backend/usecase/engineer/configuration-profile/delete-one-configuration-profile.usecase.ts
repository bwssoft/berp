
import { singleton } from "@/app/lib/util/singleton";
import type { IConfigurationProfile } from "@/backend/domain/engineer/entity/configuration-profile.definition";
import type { IConfigurationProfileRepository } from "@/backend/domain/engineer/repository/configuration-profile.repository.interface";
import { configurationProfileRepository } from "@/backend/infra";

class DeleteOneConfigurationProfileUsecase {
  repository: IConfigurationProfileRepository;

  constructor() {
    this.repository = configurationProfileRepository;
  }

  async execute(input: Partial<IConfigurationProfile>) {
    return await this.repository.deleteOne(input);
  }
}

export const deleteOneConfigurationProfileUsecase = singleton(
  DeleteOneConfigurationProfileUsecase
);
