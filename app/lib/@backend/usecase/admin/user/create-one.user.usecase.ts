import {
  formatWelcomeEmail,
  generateRandomPassword,
  singleton,
} from "@/app/lib/util";
import {
  AuditDomain,
  IBMessageGateway,
  IUser,
  IUserRepository,
} from "@/app/lib/@backend/domain";
import { bmessageGateway, userObjectRepository, userRepository } from "@/app/lib/@backend/infra";
import { randomInt } from "crypto";
import { hash } from "bcrypt";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "../audit";

namespace Dto {
  export type Input = {
    id: string;
    active: boolean;
    formData: FormData;
  };

  export type Output = {
    success: boolean;
    error?: {
      global?: string;
      username?: string;
      name?: string;
      cpf?: string;
      email?: string;
      profile_id?: string
      lock?: string;
      active?: string;
      image?: string
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
    input: Omit<IUser, "id" | "created_at" | "password" | "temporary_password"> & {
      formData: FormData;
    }
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

      
    try {
      let payload = null;

      // carrega a imagem(blob) que retornou do formData
      const file = input.formData.get("file") as File;

      if (file instanceof Blob) {
        // arrayBuffer transforma o blob em buffer, isso significa que ele le o blob e transforma em buffer, e buffer é um array
        const buffer = await file.arrayBuffer();
    
        const key = `${user.id}/${file.name}`;
    
        payload = {
          data: Buffer.from(buffer),
          key,
        };
        
        // envia as imagens do formData pro s3 utilizado o repository do s3
        await userObjectRepository.create(payload);
      }

      const html = await formatWelcomeEmail({
        name: user.name,
        username: user.username,
        password: temporaryPassword,
      });
      
      // 2º passo, enviar o email com a senha gerada
      await this.bmessageGateway.html({
        to: user.email,
        subject: "BCube – Primeiro acesso ",
        html,
        attachments: [],
      });

      // 3º passo, cria o usuário e salva a imagem
      await this.repository.create({
        ...user,
        image: payload ? {
          key: payload.key,
        }: undefined,
      });

      const session = await auth();
      const { name, email, id: user_id } = session?.user!;
      await createOneAuditUsecase.execute({
        after: user,
        before: {},
        domain: AuditDomain.user,
        user: { email, name, id: user_id },
        action: `Usuário '${user.name}' cadastrado`,
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
