import { Filter } from "mongodb";
import { userRepository } from "@/app/lib/@backend/infra";
import { AuditDomain } from "@/app/lib/@backend/domain/admin/entity/audit.definition";
import { IUser } from "@/app/lib/@backend/domain/admin/entity/user.definition";
import { IUserRepository } from "@/app/lib/@backend/domain/admin/repository/user.repository.interface";
import { createOneAuditUsecase } from "../audit";
import { auth } from "@/auth";

namespace Dto {
    export type Input = { id: string; lock: boolean };
    export type Output = { success: boolean; error?: string };
}

export const lockUserUsecase = async (
    input: Dto.Input,
    repo: IUserRepository = userRepository
): Promise<Dto.Output> => {
    const { id, lock } = input;

    const filter: Filter<{ id: string }> = { id };
    const update = { $set: { lock} };

    try {
        const oldUser = await repo.findOne({ id: input.id });
        if (!oldUser) {
            return {
            success: false,
            error: "Usuário não encontrado",
            };
        }

        const result = await repo.updateOne(filter, update);

        const after = await repo.findOne({ id: input.id });
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
            action: `Usuário '${after.name}' ${lock ? "bloqueado" : "desbloqueado"}.`,
        });

        return { success: result.modifiedCount > 0 };

    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : JSON.stringify(err),
        };
    }
};
