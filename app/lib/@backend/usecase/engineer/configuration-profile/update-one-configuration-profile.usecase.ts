import { singleton } from "@/app/lib/util/singleton";
import IConfigurationProfile from "@/app/lib/@backend/domain/engineer/entity/configuration-profile.definition";
import { configurationProfileRepository } from "@/app/lib/@backend/infra";

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
