import { singleton } from "@/app/lib/util/singleton";
import { IUser, IUserRepository } from "@/app/lib/@backend/domain";
import { userRepository } from "@/app/lib/@backend/infra";
import { createOneAuditUsecase } from "@/app/lib/@backend/usecase/admin/audit";
import { AuditDomain } from "@/app/lib/@backend/domain";
import { auth } from "@/auth";

class UpdateOneUserUsecase {
  repository: IUserRepository;

  constructor() {
    this.repository = userRepository;
  }

  async execute(
    query: { id: string },
    value: Partial<Omit<IUser, "id" | "created_at">>
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

      const result = await this.repository.updateOne(query, {
        $set: value,
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
