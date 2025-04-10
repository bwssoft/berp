import { singleton } from "@/app/lib/util/singleton";
import { IProfile, IProfileRepository } from "@/app/lib/@backend/domain";
import { profileRepository } from "@/app/lib/@backend/infra";

class CreateOneProfileUsecase {
  repository: IProfileRepository;

  constructor() {
    this.repository = profileRepository;
  }

  async execute(input: Omit<IProfile, "id" | "created_at">) {
    const _input = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID(),
    });

    try {
      const profile = await this.repository.findOne({ name: input.name });
      if (profile) {
        return {
          success: false,
          error: { name: "Nome já cadastrado para outro perfil!" },
        };
      }
      await this.repository.create(_input);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: {
          global: err instanceof Error ? err.message : JSON.stringify(err),
        },
      };
    }
  }
}

export const createOneProfileUsecase = singleton(CreateOneProfileUsecase);
