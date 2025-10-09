import { singleton } from "@/app/lib/util/singleton";
import IConfigurationProfile from "@/backend/domain/engineer/entity/configuration-profile.definition";
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
    if (!session) return;
    const configuration_profile = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID(),
      user_id: session.user.id,
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

