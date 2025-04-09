import { singleton } from "@/app/lib/util";
import { IProfileRepository, IUserRepository } from "../../../domain";
import { profileRepository, userRepository } from "../../../infra";

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

      // Atualizar o perfil
      await this.profileRepository.updateOne({ id }, { $set: { active } });

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
