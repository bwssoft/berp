import { singleton } from "@/app/lib/util/singleton"
import { IConfigurationProfile } from "@/backend/domain/engineer/entity/configuration-profile.definition";
import { IConfigurationProfileRepository } from "@/backend/domain/engineer/repository/configuration-profile.repository";
import { configurationProfileRepository } from "@/backend/infra"

class DeleteOneConfigurationProfileUsecase {
  repository: IConfigurationProfileRepository

  constructor() {
    this.repository = configurationProfileRepository
  }

  async execute(input: Partial<IConfigurationProfile>) {
    return await this.repository.deleteOne(input)
  }
}

export const deleteOneConfigurationProfileUsecase = singleton(DeleteOneConfigurationProfileUsecase)

