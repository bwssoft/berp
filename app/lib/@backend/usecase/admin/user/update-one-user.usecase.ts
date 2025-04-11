import { singleton } from "@/app/lib/util/singleton";
import { IUser, IUserRepository } from "@/app/lib/@backend/domain";
import { userRepository } from "@/app/lib/@backend/infra";

import { createOneAuditUsecase } from "@/app/lib/@backend/usecase/admin/audit";
import { AuditDomain } from "@/app/lib/@backend/domain";

class UpdateOneUserUsecase {
    repository: IUserRepository;

    constructor() {
        this.repository = userRepository;
    }

    async execute(
        query: { id: string },
        value: Partial<Omit<IUser, "id" | "created_at">>,
        actor: { id: string; name: string; email: string }
    ) {
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

        try {
            const result = await this.repository.updateOne(query, {
                $set: value,
            });
            if (!result.modifiedCount) return result;

            const after = await this.repository.findOne({ id: query.id });
            if (!after) {
                return {
                    success: false,
                    error: { id: "Usuário não encontrado após atualização" },
                };
            }

            await createOneAuditUsecase.execute<IUser, IUser>({
                before,
                after,
                domain: AuditDomain.user,
                user: actor,
            });

            return result;
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }
}

export const updateOneUserUsecase = singleton(UpdateOneUserUsecase);
