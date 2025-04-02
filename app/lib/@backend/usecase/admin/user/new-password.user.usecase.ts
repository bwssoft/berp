import { singleton } from "@/app/lib/util";
import { IUserRepository } from "../../../domain/admin/repository/user.repository.interface"
import { userRepository } from "../../../infra/repository/mongodb/admin/user.repository";

namespace Dto {
    export type Input = { id: string; password: string } 
    export type Output = { success: boolean; error?: string; } 
}

class NewPasswordUserUsecase {
    repository: IUserRepository

    constructor() {
        this.repository = userRepository;
    }

    async execute(input: Dto.Input): Promise<Dto.Output> {
        const { id, password } = input;

        try {
            await this.repository.updateOne({id}, { $set: { password } });
            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false, error: err instanceof Error ? err.message : JSON.stringify(err)};
        }

    }
}

export const newPasswordUserUsecase = singleton(NewPasswordUserUsecase);