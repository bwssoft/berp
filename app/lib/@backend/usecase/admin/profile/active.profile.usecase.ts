import { singleton } from "@/app/lib/util";
import {
  AuditDomain,
  IProfileRepository,
  IUserRepository,
} from "../../../domain";
import { profileRepository, userRepository } from "../../../infra";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "../audit";

namespace Dto {
  export type Input = {
    id: string;
    active: boolean;
  };
  export type Output = { success: boolean; error?: string };
}

class ActiveProfileUsecase {
  profileRepository: IProfileRepository;
  userRepository: IUserRepository;

  constructor() {
    this.profileRepository = profileRepository;
    this.userRepository = userRepository;
  }

  async execute(input: Dto.Input): Promise<Dto.Output> {
    const { id, active } = input;

    try {
      // Buscar pelo perfil
      const profile = await this.profileRepository.findOne({ id });

      // Caso o perfil não exista
      if (!profile) {
        return {
          success: false,
          error: "Perfil não encontrado.",
        };
      }

      // Caso for a caso de uso de inativar, checar se existem usuários vinculados a esse perfil
      if (!active) {
        const userWithProfile = await this.userRepository.findAll(
          {
            "profile.id": input.id,
          },
          2
        );

        if (userWithProfile.length) {
          return {
            success: false,
            error:
              "Atenção! Não é possível inativar um perfil com usuários vinculados.",
          };
        }
      }

      const before = await this.profileRepository.findOne({ id: input.id });
      if (!before)
        return {
          success: false,
          error: "Profile not found.",
        };

      // Atualizar o perfil
      await this.profileRepository.updateOne({ id }, { $set: { active } });

      const after = await this.profileRepository.findOne({ id: input.id });
      if (!after)
        return {
          success: false,
          error: "Profile not found.",
        };

      const session = await auth();
      const { name, email, id: user_id } = session?.user!;
      await createOneAuditUsecase.execute({
        after,
        before,
        domain: AuditDomain.profile,
        user: { email, name, id: user_id },
        action: `Perfil ${input.active ? "ativado" : "inativado"}`,
      });

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : JSON.stringify(err),
      };
    }
  }
}

export const activeProfileUsecase = singleton(ActiveProfileUsecase);
