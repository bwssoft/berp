
import { singleton } from "@/app/lib/util/singleton";
import type { IConfigurationProfile } from "@/backend/domain/engineer/entity/configuration-profile.definition";
import type { IConfigurationProfileRepository } from "@/backend/domain/engineer/repository/configuration-profile.repository.interface";
import { configurationProfileRepository } from "@/backend/infra";
import { auth } from "@/auth";

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
    const session = await auth();
    if (!session) {
      return;
    }

    const configurationProfile = Object.assign(input, {
      id: crypto.randomUUID(),
      created_at: new Date(),
      user_id: session.user.id,
      validation: {
        by_human: false,
        by_system: false,
      },
    });

    await this.repository.create(configurationProfile);
    return configurationProfile;
  }
}

export const createOneConfigurationProfileUsecase = singleton(
  CreateOneConfigurationProfileUsecase
);
