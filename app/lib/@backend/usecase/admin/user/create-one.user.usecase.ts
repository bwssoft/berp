import { singleton } from "@/app/lib/util/singleton"
import { generateRandomPassword } from "@/app/lib/util/generate-random-password"
import { IUserRepository } from "../../../domain/admin/repository/user.repository.interface";
import { userRepository } from "../../../infra/repository/mongodb/admin/user.repository";
import { IUser } from "../../../domain/admin/entity/user.definition";
import { hash } from "bcrypt"
import { randomInt } from "crypto"
import { IBMessageGateway } from "../../../domain/@shared/gateway/bmessage.gateway.interface";
import { bmessageGateway } from "../../../infra/gateway/bmessage/bmessage.gateway";
import { formatWelcomeEmail } from "@/app/lib/util/format-template-email";

class CreateOneUserUsecase {
  repository: IUserRepository
  bmessageGateway: IBMessageGateway

  constructor() {
    this.repository = userRepository
    this.bmessageGateway = bmessageGateway
  }
  

  async execute(input: Omit<IUser, "id" | "created_at" | "password">){
    const temporaryPassword = generateRandomPassword();
    const randomSalt =  randomInt(10, 16)

    const passwordHash = await hash(temporaryPassword, randomSalt);
  
    const user = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID(),
      password: passwordHash,
    });
    
    // 1º passo, criar o usuario (ok)
    // 2º passo, enviar o email com a senha gerada (implementar)
    try {
      await this.repository.create(user)
      const html = await formatWelcomeEmail({
        name: user.name,
        username: user.username,
        password: temporaryPassword,
      });
      await this.bmessageGateway.html({ to: user.email, subject: "BCube – Primeiro acesso ", html, attachments: [] });
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : JSON.stringify(err) };
    }
    // 3º passo, controle de histórico de criacao (implementar)
  
  }
  
}

export const createOneUserUsecase = singleton(CreateOneUserUsecase)