import { Filter } from "mongodb";
import { IUserRepository } from "../../../domain/admin/repository/user.repository.interface";
import { userRepository } from "../../../infra/repository/mongodb/admin/user.repository";

export namespace Dto {
    export type Input = {
        id: string;
        lock: boolean;
    };

    export type Output = {
        success: boolean;
        error?: string;
    };
}

export class LockUserUsecase {
    private repository: IUserRepository;

    constructor() {
        this.repository = userRepository;
    }

    async execute(input: Dto.Input): Promise<Dto.Output> {
        const { id, lock } = input;
        const filter: Filter<{ id: string }> = { id };
        const update = { $set: { lock } };

        try {
            const result = await this.repository.updateOne(filter, update);
            return { success: result.modifiedCount > 0 };
        } catch (err) {
            return {
                success: false,
                error: err instanceof Error ? err.message : JSON.stringify(err),
            };
        }
    }
}
