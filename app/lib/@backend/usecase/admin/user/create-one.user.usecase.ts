import { singleton } from "@/app/lib/util/singleton"
import { generateRandomPassword } from "@/app/lib/util/generateRandomPassword"
import { IUserRepository } from "../../../domain/admin/repository/user.repository.interface";
import { userRepository } from "../../../infra/repository/mongodb/admin/user.repository";
import { IUser } from "../../../domain/admin/entity/user.definition";
import { hash } from "bcrypt"
import { randomInt } from "crypto"

class CreateOneUserUsecase {
  repository: IUserRepository

  constructor() {
    this.repository = userRepository
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
    // 3º passo, controle de histórico de criacao (implementar)
  
    return await this.repository.create(user)
  }
  
}

export const createOneUserUsecase = singleton(CreateOneUserUsecase)
