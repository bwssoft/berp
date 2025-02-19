import { singleton } from "@/app/lib/util/singleton";
import {
  IConfigurationProfile,
  IConfigurationProfileRepository,
} from "@/app/lib/@backend/domain";
import { configurationProfileRepository } from "@/app/lib/@backend/infra";

class CreateOneConfigurationProfileUsecase {
  repository: IConfigurationProfileRepository;

  constructor() {
    this.repository = configurationProfileRepository;
  }

  async execute(
    input: Omit<
      IConfigurationProfile,
      "id" | "created_at" | "user_id" | "validation"
    >
  ) {
    const configuration_profile = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID(),
      user_id: crypto.randomUUID(),
      validation: {
        by_human: false,
        by_system: false,
      },
    });
    await this.repository.create(configuration_profile);
    return configuration_profile;
  }
}

export const createOneConfigurationProfileUsecase = singleton(
  CreateOneConfigurationProfileUsecase
);
