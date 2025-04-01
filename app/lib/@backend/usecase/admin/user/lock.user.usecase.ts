import { Filter } from "mongodb";
import { IUserRepository } from "../../../domain/admin/repository/user.repository.interface";
import { userRepository } from "../../../infra/repository/mongodb/admin/user.repository";

export namespace Dto {
    export type Input = {
        id: string;
        lock: boolean;
    };

    export type Output = {
        ok: boolean;
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

        const update = {
            $set: { lock },
        };

        const result = await this.repository.updateOne(filter, update);

        return { ok: result.modifiedCount > 0 };
    }
}
