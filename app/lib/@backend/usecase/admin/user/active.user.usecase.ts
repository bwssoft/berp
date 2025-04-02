import { singleton } from "@/app/lib/util/singleton";
import { userRepository } from "../../../infra/repository/mongodb/admin/user.repository";
import { IUserRepository } from "../../../domain/admin/repository/user.repository.interface";
import { resetPasswordUserUsecase } from "./reset-password.user.usecase";

namespace Dto {
  export type Input = {
    id: string;
    active: boolean;
  };

  export type Output = {
    success: boolean;
    error?: string;
  };
}

class ActiveUserUsecase {
  repository: IUserRepository;

  constructor() {
    this.repository = userRepository;
  }

  async execute(input: Dto.Input): Promise<Dto.Output> {
    const { id, active } = input;

    try {
      const updated = await this.repository.updateOne({ id }, { $set: { active } })

      if (!updated) {
        return { success: false, error: "Usuário não encontrado ou não atualizado." };
      }

      // Se ativar o usuário, deve resetar a senha
      if (active) {
          const reset = await resetPasswordUserUsecase.execute({ id });

          if (!reset.success) {
            return { success: false, error: reset.error };
          }
      }

      return { success: true };
    } catch (err: any) {
      console.error("Erro ao ativar/inativar usuário:", err);
      return {success: false, error: err instanceof Error ? err.message : JSON.stringify(err)}
    }
  }
}

export const activeUserUsecase = singleton(ActiveUserUsecase);
