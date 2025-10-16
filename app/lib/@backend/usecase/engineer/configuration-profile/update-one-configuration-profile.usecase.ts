
import { singleton } from "@/app/lib/util/singleton";
import type { IConfigurationProfile } from "@/backend/domain/engineer/entity/configuration-profile.definition";
import type { IConfigurationProfileRepository } from "@/backend/domain/engineer/repository/configuration-profile.repository.interface";
import { configurationProfileRepository } from "@/backend/infra";

class UpdateOneConfigurationProfileUsecase {
  repository: IConfigurationProfileRepository;

  constructor() {
    this.repository = configurationProfileRepository;
  }

  async execute(
    query: { id: string },
    value: Partial<Omit<IConfigurationProfile, "id" | "created_at" | "user_id">>
  ) {
    return await this.repository.updateOne(query, { $set: value });
  }
}

export const updateOneConfigurationProfileUsecase = singleton(
  UpdateOneConfigurationProfileUsecase
);
