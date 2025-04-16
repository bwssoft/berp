import { singleton } from "@/app/lib/util/singleton";
import { AuditDomain, IUser, IUserRepository } from "@/app/lib/@backend/domain";
import { userObjectRepository, userRepository } from "@/app/lib/@backend/infra";
import { createOneAuditUsecase } from "../audit";
import { auth } from "@/auth";

class UpdateOneUserUsecase {
  repository: IUserRepository;

  constructor() {
    this.repository = userRepository;
  }

  async execute(
    query: { id: string },
    value: Partial<Omit<IUser, | "id" | "created_at">>,
    formData: FormData
  ) {
    try {
      if (value.email) {
        const emailExists = await this.repository.findOne({
          email: value.email,
          id: { $ne: query.id },
        });
        if (emailExists) {
          return {
            success: false,
            error: { email: "Email já cadastrado para outro usuário!" },
          };
        }
      }

      if (value.cpf) {
        const cpfExists = await this.repository.findOne({
          cpf: value.cpf,
          id: { $ne: query.id },
        });
        if (cpfExists) {
          return {
            success: false,
            error: { cpf: "CPF já cadastrado em outro usuário!" },
          };
        }
      }

      if (value.username) {
        const usernameExists = await this.repository.findOne({
          username: value.username,
          id: { $ne: query.id },
        });
        if (usernameExists) {
          return {
            success: false,
            error: {
              username: "Username já cadastrado para outro usuário!",
            },
          };
        }
      }

      const before = await this.repository.findOne({ id: query.id });
      if (!before) {
        return {
          success: false,
          error: { id: "Usuário não encontrado" },
        };
      }

      let payload = null;

      // carrega a imagem(blob) que retornou do formData
      const file = formData.get("file") as File;

      if (file instanceof Blob) {
        // arrayBuffer transforma o blob em buffer, isso significa que ele le o blob e transforma em buffer, e buffer é um array
        const buffer = await file.arrayBuffer();
    
        const key = `${query.id}/${file.name}`;
    
        payload = {
          data: Buffer.from(buffer),
          key,
        };
        
        // envia as imagens do formData pro s3 utilizado o repository do s3
        await userObjectRepository.create(payload);
      }

      const result = await this.repository.updateOne(query, {
        $set: {
          ...value,
          image: payload ? {
            key: payload.key,
          }: undefined,
        },
      });

      if (!result.modifiedCount)
        return {
          success: false,
          error: {
            global: "Algo deu errado.",
          },
        };

      const after = await this.repository.findOne({ id: query.id });
      if (!after) {
        return {
          success: false,
          error: { id: "Usuário não encontrado após atualização" },
        };
      }
      const session = await auth();
      const { name, id, email } = session?.user!;
      await createOneAuditUsecase.execute<IUser, IUser>({
        before,
        after,
        domain: AuditDomain.user,
        user: { name, id, email },
        action: `Usuário '${after.name}' atualizado`,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          global:
            error instanceof Error ? error.message : JSON.stringify(error),
        },
      };
    }
  }
}

export const updateOneUserUsecase = singleton(UpdateOneUserUsecase);
