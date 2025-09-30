import {
  singleton,
  generateRandomPassword,
  formatResetPasswordEmail,
} from "@/app/lib/util";

import { hash } from "bcrypt";
import { randomInt } from "crypto";
import { AuditDomain, IBMessageGateway, IUser, IUserRepository } from "@/app/lib/@backend/domain";
import { userRepository, bmessageGateway } from "@/app/lib/@backend/infra";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "../audit";

namespace Dto {
  export type Input = {
    id: string;
  };

  export type Output = {
    success: boolean;
    error?: string | { 
      id?: string; 
      email?: string; 
      cpf?: string; 
      username?: string 
    };
  };
}

class ResetPasswordUserUsecase {
  private repository: IUserRepository;
  private bmessageGateway: IBMessageGateway;

  constructor() {
    this.repository = userRepository;
    this.bmessageGateway = bmessageGateway;
  }

  async execute(input: Dto.Input): Promise<Dto.Output> {
    
    try {
      const user = await this.repository.findOne({ id: input.id });

      if (!user) {
        return { success: false, error: "Usuário não encontrado." };
      }

      const temporaryPassword = generateRandomPassword();
      const salt = randomInt(10, 16);
      const hashedPassword = await hash(temporaryPassword, salt);

      const oldUser = await this.repository.findOne({ id: input.id });
      if (!oldUser) {
        return {
          success: false,
          error: { id: "Usuário não encontrado" },
        };
      }
      await this.repository.updateOne(
        { id: input.id },
        { $set: { password: hashedPassword, temporary_password: true } }
      );

      const after = await this.repository.findOne({ id: input.id });
      if (!after) {
        return {
          success: false,
          error: { id: "Usuário não encontrado após atualização" },
        };
      }

      const session = await auth();
      if(session) {
        const { name, id, email } = session?.user!;
  
        await createOneAuditUsecase.execute<IUser, IUser>({
            before: oldUser,
            after,
            domain: AuditDomain.user,
            user: { name, id, email },
            action: `Usuário '${after.name}' teve a senha redefinida.`,
        });
      }

      const html = await formatResetPasswordEmail({
        name: user.name,
        username: user.username,
        password: temporaryPassword,
      });

      await this.bmessageGateway.html({
        to: user.email,
        subject: "BCube – Reset de senha",
        html,
        attachments: [],
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

export const resetPasswordUserUsecase = singleton(ResetPasswordUserUsecase);
