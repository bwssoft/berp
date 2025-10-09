import { singleton } from "@/app/lib/util/singleton";

import { resetPasswordUserUsecase } from "./reset-password.user.usecase";
import { userRepository } from "@/app/lib/@backend/infra";
import { AuditDomain } from "@/app/lib/@backend/domain/admin/entity/audit.definition";
import { IUser } from "@/app/lib/@backend/domain/admin/entity/user.definition";
import { IUserRepository } from "@/app/lib/@backend/domain/admin/repository/user.repository.interface";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "../audit";

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
        const { active } = input;

        try {
            const oldUser = await this.repository.findOne({ id: input.id });
            if (!oldUser) {
                return {
                success: false,
                error: "Usuário não encontrado",
                };
            }

            const updated = await this.repository.updateOne(
                { id: input.id },
                { $set: { active } }
            );

            const after = await this.repository.findOne({ id: input.id });
            if (!after) {
                return {
                success: false,
                error: "Usuário não encontrado após atualização"
                }
            }

            const session = await auth();
            const { name, id, email } = session?.user!;

            await createOneAuditUsecase.execute<IUser, IUser>({
                before: oldUser,
                after,
                domain: AuditDomain.user,
                user: { name, id, email },
                action: `Usuário '${after.name}' ${active ? "ativado" : "inativado"}.`,
            });

            if (!updated) {
                return {
                    success: false,
                    error: "Usuário não encontrado ou não atualizado.",
                };
            }

            // Se ativar o usuário, deve resetar a senha
            if (active) {
                const reset = await resetPasswordUserUsecase.execute({id:input.id });

                if (!reset.success) {
                    return { success: false, error: typeof reset.error === "string" ? reset.error : JSON.stringify(reset.error) };
                }
            }

            return { success: true };
        } catch (err: any) {
            console.error("Erro ao ativar/inativar usuário:", err);
            return {
                success: false,
                error: err instanceof Error ? err.message : JSON.stringify(err),
            };
        }
    }
}

export const activeUserUsecase = singleton(ActiveUserUsecase);
