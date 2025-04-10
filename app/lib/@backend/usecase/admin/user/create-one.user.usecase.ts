import {
  formatWelcomeEmail,
  generateRandomPassword,
  singleton,
} from "@/app/lib/util";
import {
  IBMessageGateway,
  IUser,
  IUserRepository,
} from "@/app/lib/@backend/domain";
import { bmessageGateway, userRepository } from "@/app/lib/@backend/infra";
import { randomInt } from "crypto";
import { hash } from "bcrypt";

namespace Dto {
  export type Input = {
    id: string;
    active: boolean;
  };

  export type Output = {
    success: boolean;
    error?: {
      global?: string;
      username?: string;
      name?: string;
      cpf?: string;
      email?: string;
      profile_id?: string[];
      lock?: boolean;
      active?: boolean;
      image?: string;
    };
  };
}

class CreateOneUserUsecase {
  repository: IUserRepository;
  bmessageGateway: IBMessageGateway;

  constructor() {
    this.repository = userRepository;
    this.bmessageGateway = bmessageGateway;
  }

  async execute(
    input: Omit<IUser, "id" | "created_at" | "password" | "temporary_password">
  ): Promise<Dto.Output> {
    const temporaryPassword = generateRandomPassword();
    const randomSalt = randomInt(10, 16);

    const passwordHash = await hash(temporaryPassword, randomSalt);

    const user = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID(),
      password: passwordHash,
      temporary_password: true,
    });

    const cpfExists = await this.repository.findOne({ cpf: user.cpf });
    if (cpfExists)
      return {
        success: false,
        error: { cpf: "CPF já cadastrado para outro usuário!" },
      };

    const emailExists = await this.repository.findOne({ email: user.email });
    if (emailExists)
      return {
        success: false,
        error: { email: "Email já cadastrado para outro usuário!" },
      };

    const usernameExists = await this.repository.findOne({
      username: user.username,
    });
    if (usernameExists)
      return {
        success: false,
        error: { username: "Usuário já utilizado em outro cadastro!" },
      };

    // 1º passo, criar o usuario (ok)
    try {
      await this.repository.create(user);
      const html = await formatWelcomeEmail({
        name: user.name,
        username: user.username,
        password: temporaryPassword,
      });
      // 2º passo, enviar o email com a senha gerada (implementar)
      await this.bmessageGateway.html({
        to: user.email,
        subject: "BCube – Primeiro acesso ",
        html,
        attachments: [],
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

export const createOneUserUsecase = singleton(CreateOneUserUsecase);
