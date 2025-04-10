import { singleton } from "@/app/lib/util/singleton";
import {
  AuditDomain,
  IProfile,
  IProfileRepository,
} from "@/app/lib/@backend/domain";
import { profileRepository } from "@/app/lib/@backend/infra";
import { createOneAuditUsecase } from "../audit";
import { auth } from "@/auth";

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

      const session = await auth();
      const { name, email, id: user_id } = session?.user!;
      await createOneAuditUsecase.execute({
        after: _input,
        before: {},
        domain: AuditDomain.profile,
        user: { email, name, id: user_id },
        action: "Perfil cadastrado",
      });

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
