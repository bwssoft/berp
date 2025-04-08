import { Filter } from "mongodb";
import { userRepository } from "@/app/lib/@backend/infra";
import { IUserRepository } from "@/app/lib/@backend/domain";

export namespace Dto {
    export type Input = { id: string; lock: boolean };
    export type Output = { success: boolean; error?: string };
}

export const lockUserUsecase = async (
    input: Dto.Input,
    repo: IUserRepository = userRepository
): Promise<Dto.Output> => {
    const { id, lock } = input;

    const filter: Filter<{ id: string }> = { id };
    const update = { $set: { lock } };

    try {
        const result = await repo.updateOne(filter, update);
        return { success: result.modifiedCount > 0 };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : JSON.stringify(err),
        };
    }
};
