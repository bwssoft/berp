import { singleton } from "@/app/lib/util/singleton"
import { IConfigurationProfile } from "@/app/lib/@backend/domain/engineer/entity/configuration-profile.definition";
import { IConfigurationProfileRepository } from "@/app/lib/@backend/domain/engineer/repository/configuration-profile.repository.interface";
import { configurationProfileRepository } from "@/app/lib/@backend/infra"

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
